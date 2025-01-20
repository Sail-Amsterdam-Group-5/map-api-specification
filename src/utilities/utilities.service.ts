import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import { Utility } from './entities/utility.entity';
import { Ocean } from '../locations/entities/location.entity';
import { v4 as uuidv4 } from 'uuid';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ConfigService } from '@nestjs/config';
import { Container, CosmosClient } from '@azure/cosmos';
import { ReadUtilityDto } from './dto/read-utility.dto';
import { LocationsService } from '../locations/locations.service';
import { CreateLocationDto } from '../locations/dto/create-location.dto';

@Injectable()
export class UtilitiesService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    private configService: ConfigService,
    private locationService: LocationsService,
  ) {
    const endpoint = this.configService.get<string>('COSMOSDB_ENDPOINT');
    const key = this.configService.get<string>('COSMOSDB_KEY');

    this.client = new CosmosClient({ endpoint, key });
    this.container = this.client
      .database(this.databaseId)
      .container(this.containerId);
  }

  private readonly client: CosmosClient;
  private readonly databaseId = this.configService.get<string>('DATABASE_ID');
  private readonly containerId = this.configService.get<string>(
    'UTILITY_CONTAINER_ID',
  );
  private container: Container;

  async create(createUtilityDto: CreateUtilityDto) {
    try {
      const entity = this.classMapper.map(
        createUtilityDto,
        CreateUtilityDto,
        Utility,
      );
      entity.typeId = entity.type + entity.id;
      entity.dates = createUtilityDto.dates;
      const location = await this.locationService.findOne(
        createUtilityDto.locationId,
      );
      if (location == undefined) {
        throw new Error('Location not found.');
      }
      const { resource } = await this.container.items.create(entity);
      const result = this.classMapper.map(resource, Utility, ReadUtilityDto);
      result.dates = resource.dates;
      result.location = location;
      return result;
    } catch (ex) {
      throw new HttpException(
        `Create error: ${ex.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      const { resources } = await this.container.items
        .query('SELECT * from c')
        .fetchAll();
      const res = await Promise.all(
        resources.map(async (resource) => {
          const result = this.classMapper.map(
            resource,
            Utility,
            ReadUtilityDto,
          );
          result.location = await this.locationService.findOne(
            resource.locationId,
          );
          result.dates = resource.dates;
          return result;
        }),
      );
      return res;
    } catch (ex) {
      throw new Error(`Find all error: ${ex.message}.`);
    }
  }

  async findOne(id: string) {
    try {
      const { resources } = await this.container.items
        .query('SELECT * from c WHERE c.id = "' + id + '"')
        .fetchNext();
      if (resources.length === 0) {
        throw new Error(`Utility with id ${id} not found.`);
      }
      const result = this.classMapper.map(
        resources[0],
        Utility,
        ReadUtilityDto,
      );
      result.location = await this.locationService.findOne(
        resources[0].locationId,
      );
      return result;
    } catch (ex) {
      throw new HttpException(
        `Find one error: ${ex.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findByTypeAndOrDate(type?: string, date?: string[]) {
    try {
      let query = 'SELECT * from c WHERE ';
      if (type == undefined && date == undefined) {
        query = 'SELECT * from c';
      } else if (type != undefined) {
        query += `c.type = "${type}"`;
      }
      const { resources } = await this.container.items.query(query).fetchAll();
      const res = await Promise.all(
        resources.map(async (resource) => {
          const result = this.classMapper.map(
            resource,
            Utility,
            ReadUtilityDto,
          );
          result.location = await this.locationService.findOne(
            resource.locationId,
          );
          result.dates = resource.dates;
          return result;
        }),
      );
      return res;
    } catch (ex) {
      throw new Error(`Find by type and or date error: ${ex.message}.`);
    }
  }

  async update(id: string, updateUtilityDto: UpdateUtilityDto) {
    try {
      const entity = this.classMapper.map(
        updateUtilityDto,
        UpdateUtilityDto,
        Utility,
      );
      entity.id = id;
      entity.dates = updateUtilityDto.dates;
      entity.name = updateUtilityDto.name;
      entity.type = updateUtilityDto.type;
      entity.description = updateUtilityDto.description;

      const { resources } = await this.container.items
        .query('SELECT * from c WHERE c.id = "' + id + '"')
        .fetchNext();
      if (resources.length === 0) {
        throw new Error(`Utility with id ${id} not found.`);
      }
      entity.locationId = updateUtilityDto.locationId;
      entity.createdAt = resources[0].createdAt;
      entity.typeId = resources[0].typeId;
      const { resource } = await this.container
        .item(resources[0].id, resources[0].typeId)
        .replace(entity);
      const result = this.classMapper.map(resource, Utility, ReadUtilityDto);
      result.location = await this.locationService.findOne(entity.locationId);
      return result;
    } catch (ex) {
      throw new Error(`Update error: ${ex.message}.`);
    }
  }

  async remove(id: string) {
    try {
      const { resources } = await this.container.items
        .query('SELECT * from c WHERE c.id = "' + id + '"')
        .fetchNext();
      await this.container.item(resources[0].id, resources[0].typeId).delete();
      return `This action removes a ${id} utility`;
    } catch (ex) {
      throw new Error(`Remove error: ${ex.message}.`);
    }
  }

  async mockData() {
    try {
      for (const utility of this.utilitiesGenerator()) {
        utility.typeId = utility.typeId + utility.id;
        const test: CreateLocationDto = new CreateLocationDto();
        test.location = utility.location.location;
        test.name = utility.location.name;
        test.icon = utility.location.icon;
        test.ocean = utility.location.ocean;
        await this.locationService.create(test);
        await this.container.items.create(utility);
      }
    } catch (ex) {
      throw new Error(`Mock error: ${ex.message}.`);
    }
  }

  private getRandomId() {
    return uuidv4();
  }

  private utilitiesGenerator(): Utility[] {
    const locations = [
      {
        id: this.getRandomId(),
        name: 'Blue Lagoon',
        location: { latitude: 52.398, longitude: 4.872 },
        icon: 'toilet',
        createdAt: new Date(),
        ocean: Ocean.Blue,
      },
      {
        id: this.getRandomId(),
        name: 'Azure Haven',
        location: { latitude: 52.4045, longitude: 4.8745 },
        icon: 'info',
        createdAt: new Date(),
        ocean: Ocean.Blue,
      },
      {
        id: this.getRandomId(),
        name: 'Sapphire Shore',
        location: { latitude: 52.407, longitude: 4.8715 },
        icon: 'food',
        createdAt: new Date(),
        ocean: Ocean.Blue,
      },
      {
        id: this.getRandomId(),
        name: 'Emerald Lagoon',
        location: { latitude: 52.4, longitude: 4.888 },
        icon: 'drink',
        createdAt: new Date(),
        ocean: Ocean.Green,
      },
      {
        id: this.getRandomId(),
        name: 'Verdant Point',
        location: { latitude: 52.4025, longitude: 4.8875 },
        icon: 'activity',
        createdAt: new Date(),
        ocean: Ocean.Green,
      },
      {
        id: this.getRandomId(),
        name: 'Snowflake Bay',
        location: { latitude: 52.3905, longitude: 4.9015 },
        icon: 'toilet',
        createdAt: new Date(),
        ocean: Ocean.White,
      },
      {
        id: this.getRandomId(),
        name: 'Frost Haven',
        location: { latitude: 52.3875, longitude: 4.904 },
        icon: 'info',
        createdAt: new Date(),
        ocean: Ocean.White,
      },
      {
        id: this.getRandomId(),
        name: 'Ice Point',
        location: { latitude: 52.392, longitude: 4.899 },
        icon: 'food',
        createdAt: new Date(),
        ocean: Ocean.White,
      },
      {
        id: this.getRandomId(),
        name: 'Golden Shore',
        location: { latitude: 52.3795, longitude: 4.922 },
        icon: 'drink',
        createdAt: new Date(),
        ocean: Ocean.Yellow,
      },
      {
        id: this.getRandomId(),
        name: 'Amber Point',
        location: { latitude: 52.378, longitude: 4.917 },
        icon: 'activity',
        createdAt: new Date(),
        ocean: Ocean.Yellow,
      },
      {
        id: this.getRandomId(),
        name: 'Citrine Cove',
        location: { latitude: 52.3755, longitude: 4.9315 },
        icon: 'toilet',
        createdAt: new Date(),
        ocean: Ocean.Yellow,
      },
      {
        id: this.getRandomId(),
        name: 'Scarlet Lagoon',
        location: { latitude: 52.3685, longitude: 4.9215 },
        icon: 'info',
        createdAt: new Date(),
        ocean: Ocean.Red,
      },
      {
        id: this.getRandomId(),
        name: 'Crimson Shore',
        location: { latitude: 52.3665, longitude: 4.925 },
        icon: 'food',
        createdAt: new Date(),
        ocean: Ocean.Red,
      },
      {
        id: this.getRandomId(),
        name: 'Ruby Point',
        location: { latitude: 52.37, longitude: 4.928 },
        icon: 'drink',
        createdAt: new Date(),
        ocean: Ocean.Red,
      },
    ];

    const utilities: Utility[] = [
      {
        id: this.getRandomId(),
        name: 'Toilet',
        description: 'Een openbaar toilet beschikbaar van 08:00 tot 22:00.',
        location: locations[0],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Toilet',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Infopunt',
        description: 'Een infobalie om bezoekers te helpen.',
        location: locations[1],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Informatiepunt',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Foodtruck Vis',
        description:
          'Een eetkraam met een verscheidenheid aan snacks en maaltijden.',
        location: locations[2],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Eten',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Cola Tappunt',
        description: 'Een drankkraam met verfrissende dranken.',
        location: locations[3],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Drinken',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Game cafe',
        description: 'Een gebied voor leuke activiteiten en spelletjes.',
        location: locations[4],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Activiteit',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Toilet',
        description: 'Een toilet beschikbaar voor openbaar gebruik.',
        location: locations[5],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Toilet',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Infopunt',
        description: 'Een plek om hulp en informatie te krijgen.',
        location: locations[6],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Informatiepunt',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Unox Stand',
        description: 'Een plek om snel snacks en maaltijden te halen.',
        location: locations[7],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Eten',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Warme Chocomelk',
        description: 'Een kraam met een verscheidenheid aan dranken en sappen.',
        location: locations[8],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Drinken',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Kaart spellen',
        description: 'Geniet hier van spelletjes en recreatieve activiteiten.',
        location: locations[9],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Activiteit',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Toilet',
        description: 'Een schoon toilet beschikbaar voor bezoekers.',
        location: locations[10],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Toilet',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Infopunt',
        description: 'Informatie en hulp beschikbaar hier.',
        location: locations[11],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Informatiepunt',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: "Nando's nachos",
        description: 'Een eetkraam die heerlijke maaltijden aanbiedt.',
        location: locations[12],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Eten',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Heineken Bar',
        description: 'Geniet hier van een scala aan dranken.',
        location: locations[13],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Drinken',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Dansvloer',
        description: 'Een levendig gebied voor activiteiten en entertainment.',
        location: locations[14],
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        type: 'Activiteit',
        createdAt: new Date(),
      },
    ];

    return utilities;
  }
}
