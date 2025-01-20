import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import { Utility } from './entities/utility.entity';
import { v4 as uuidv4 } from 'uuid';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ConfigService } from '@nestjs/config';
import { Container, CosmosClient } from '@azure/cosmos';
import { ReadUtilityDto } from './dto/read-utility.dto';
import { LocationsService } from '../locations/locations.service';

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
        utility.typeId = utility.type + utility.id;
        const test = new CreateUtilityDto();
        test.dates = utility.dates;
        test.description = utility.description;
        test.locationId = utility.locationId;
        test.name = utility.name;
        test.type = utility.type;
        await this.create(test);
      }
    } catch (ex) {
      throw new Error(`Mock error: ${ex.message}.`);
    }
  }

  private getRandomId() {
    return uuidv4();
  }

  // private locationsGenerator(): Location[] {
  //   const locations = [
  //     {
  //       id: this.getRandomId(),
  //       name: 'Blue Lagoon',
  //       location: { latitude: 52.398, longitude: 4.872 },
  //       icon: 'toilet',
  //       createdAt: new Date(),
  //       ocean: Ocean.Blue,
  //     },
  //     {
  //       id: this.getRandomId(),
  //       name: 'Azure Haven',
  //       location: { latitude: 52.4045, longitude: 4.8745 },
  //       icon: 'info',
  //       createdAt: new Date(),
  //       ocean: Ocean.Blue,
  //     },
  //     {
  //       id: this.getRandomId(),
  //       name: 'Sapphire Shore',
  //       location: { latitude: 52.407, longitude: 4.8715 },
  //       icon: 'food',
  //       createdAt: new Date(),
  //       ocean: Ocean.Blue,
  //     },
  //     {
  //       id: this.getRandomId(),
  //       name: 'Emerald Lagoon',
  //       location: { latitude: 52.4, longitude: 4.888 },
  //       icon: 'drink',
  //       createdAt: new Date(),
  //       ocean: Ocean.Green,
  //     },
  //     {
  //       id: this.getRandomId(),
  //       name: 'Verdant Point',
  //       location: { latitude: 52.4025, longitude: 4.8875 },
  //       icon: 'activity',
  //       createdAt: new Date(),
  //       ocean: Ocean.Green,
  //     },
  //     {
  //       id: this.getRandomId(),
  //       name: 'Snowflake Bay',
  //       location: { latitude: 52.3905, longitude: 4.9015 },
  //       icon: 'toilet',
  //       createdAt: new Date(),
  //       ocean: Ocean.White,
  //     },
  //     {
  //       id: this.getRandomId(),
  //       name: 'Frost Haven',
  //       location: { latitude: 52.3875, longitude: 4.904 },
  //       icon: 'info',
  //       createdAt: new Date(),
  //       ocean: Ocean.White,
  //     },
  //     {
  //       id: this.getRandomId(),
  //       name: 'Ice Point',
  //       location: { latitude: 52.392, longitude: 4.899 },
  //       icon: 'food',
  //       createdAt: new Date(),
  //       ocean: Ocean.White,
  //     },
  //     {
  //       id: this.getRandomId(),
  //       name: 'Golden Shore',
  //       location: { latitude: 52.3795, longitude: 4.922 },
  //       icon: 'drink',
  //       createdAt: new Date(),
  //       ocean: Ocean.Yellow,
  //     },
  //     {
  //       id: this.getRandomId(),
  //       name: 'Amber Point',
  //       location: { latitude: 52.378, longitude: 4.917 },
  //       icon: 'activity',
  //       createdAt: new Date(),
  //       ocean: Ocean.Yellow,
  //     },
  //     {
  //       id: this.getRandomId(),
  //       name: 'Citrine Cove',
  //       location: { latitude: 52.3755, longitude: 4.9315 },
  //       icon: 'toilet',
  //       createdAt: new Date(),
  //       ocean: Ocean.Yellow,
  //     },
  //     {
  //       id: this.getRandomId(),
  //       name: 'Scarlet Lagoon',
  //       location: { latitude: 52.3685, longitude: 4.9215 },
  //       icon: 'info',
  //       createdAt: new Date(),
  //       ocean: Ocean.Red,
  //     },
  //     {
  //       id: this.getRandomId(),
  //       name: 'Crimson Shore',
  //       location: { latitude: 52.3665, longitude: 4.925 },
  //       icon: 'food',
  //       createdAt: new Date(),
  //       ocean: Ocean.Red,
  //     },
  //     {
  //       id: this.getRandomId(),
  //       name: 'Ruby Point',
  //       location: { latitude: 52.37, longitude: 4.928 },
  //       icon: 'drink',
  //       createdAt: new Date(),
  //       ocean: Ocean.Red,
  //     },
  //   ];
  //
  //   return locations;
  // }

  private utilitiesGenerator(): Utility[] {
    const utilities: Utility[] = [
      {
        id: this.getRandomId(),
        name: 'Toilet',
        description: 'Een openbaar toilet beschikbaar van 08:00 tot 22:00.',
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        locationId: '3044b6e8-885b-46d1-8b46-6d51902ea5b8',
        type: 'Toilet',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Infopunt',
        description: 'Een infobalie om bezoekers te helpen.',
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        locationId: '354ee77e-db99-412a-8d62-bf6c7a9cef50',
        type: 'Informatiepunt',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Foodtruck Vis',
        description:
          'Een eetkraam met een verscheidenheid aan snacks en maaltijden.',
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        locationId: '8891641b-3aea-4e0d-b710-ff0f8df78c14',
        type: 'Eten',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Cola Tappunt',
        description: 'Een drankkraam met verfrissende dranken.',
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        locationId: '3e5d633e-70d3-449e-b5ca-d22661023364',
        type: 'Drinken',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Game cafe',
        description: 'Een gebied voor leuke activiteiten en spelletjes.',
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        locationId: '5d51cd99-3372-406a-9090-4c18a5b463fb',
        type: 'Activiteit',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Toilet',
        description: 'Een toilet beschikbaar voor openbaar gebruik.',
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        locationId: '8cefd3df-d7b0-4f3e-9db9-3527a6a72892',
        type: 'Toilet',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Infopunt',
        description: 'Een plek om hulp en informatie te krijgen.',
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        locationId: 'b3b5a711-f5c8-4d5c-a016-850962aa95e0',
        type: 'Informatiepunt',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Unox Stand',
        description: 'Een plek om snel snacks en maaltijden te halen.',
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        locationId: 'a6b6c544-840d-4e29-9102-1cb5610e5969',
        type: 'Eten',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Warme Chocomelk',
        description: 'Een kraam met een verscheidenheid aan dranken en sappen.',
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        locationId: '6238a893-7f34-4616-a837-69a2b20fb1b6',
        type: 'Drinken',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Kaart spellen',
        description: 'Geniet hier van spelletjes en recreatieve activiteiten.',
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        locationId: 'd6c74138-b861-4f42-89ec-3b85525cf70a',
        type: 'Activiteit',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Toilet',
        description: 'Een schoon toilet beschikbaar voor bezoekers.',
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        locationId: '18137d5d-3c49-4a08-b1d1-2848537965b9',
        type: 'Toilet',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Infopunt',
        description: 'Informatie en hulp beschikbaar hier.',
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        locationId: '7306fcac-027c-4aef-83f0-2abf3155b422',
        type: 'Informatiepunt',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: "Nando's nachos",
        description: 'Een eetkraam die heerlijke maaltijden aanbiedt.',
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        locationId: '49843757-a78d-45ec-8adc-ee93a81ef8a7',
        type: 'Eten',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Heineken Bar',
        description: 'Geniet hier van een scala aan dranken.',
        dates: [
          'Wed Aug 20 2025',
          'Thu Aug 21 2025',
          'Fri Aug 22 2025',
          'Sat Aug 23 2025',
          'Sun Aug 24 2025',
        ],
        locationId: 'd95a8ee4-071c-4498-9345-b26dc79c35f6',
        type: 'Drinken',
        createdAt: new Date(),
      },
    ];

    return utilities;
  }
}
