import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location, Ocean } from './entities/location.entity';
import { v4 as uuidv4 } from 'uuid';
import { Container, CosmosClient } from '@azure/cosmos';
import process from 'node:process';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ConfigService } from '@nestjs/config';
import { ReadLocationDto } from './dto/read-location.dto';

@Injectable()
export class LocationsService {

  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    private configService: ConfigService
  ) {
    const endpoint = this.configService.get<string>("COSMOSDB_ENDPOINT");
    const key = this.configService.get<string>("COSMOSDB_KEY");

    this.client = new CosmosClient({ endpoint, key });
    this.container = this.client.database(this.databaseId).container(this.containerId);
  }

  private readonly client: CosmosClient;
  private readonly databaseId = this.configService.get<string>("DATABASE_ID"); // Replace with your database ID
  private readonly containerId = this.configService.get<string>("LOCATION_CONTAINER_ID"); // Replace with your container ID
  private container: Container;

  async create(createLocationDto: CreateLocationDto) {
    try {
      const entity = this.classMapper.map(createLocationDto, CreateLocationDto, Location);
      entity.longLang = entity.ocean + entity.id;
      entity.createdAt = new Date();
      const { resource } = await this.container.items.create(entity);
      const result = this.classMapper.map(resource, Location, ReadLocationDto);
      result.location = resource.location;
      return result;
    }
    catch (ex) {
      throw new Error(`Create error: ${ex.message}.`);
    }
  }

  async findAll() {
    try {
      const { resources } = await this.container.items.query('SELECT * from c').fetchAll();
      console.log('test', resources);
      return resources.map((resource) => {
        const result = this.classMapper.map(resource, Location, ReadLocationDto);
        result.location = resource.location;
        return result;
      });
    } catch (ex) {
      throw new Error(`Find all error: ${ex.message}.`);
    }
  }

  async findOne(id: string) {
    try {
      const { resources } = await this.container.items.query('SELECT * from c WHERE c.id = "' + id + '"').fetchNext();
      if (resources.length === 0) {
        throw new Error(`Location with id ${id} not found.`);
      }
      const result = this.classMapper.map(resources[0], Location, ReadLocationDto);
      result.location = resources[0].location;
      return result;
    } catch (ex) {
      throw new HttpException(`Find one error: ${ex.message}`, HttpStatus.NOT_FOUND);
    }
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    // const location = new Location();
    // location.id = id;
    // location.location = updateLocationDto.location;
    // location.icon = updateLocationDto.icon;
    // location.createdAt = new Date();
    // location.ocean = updateLocationDto.ocean;
    // location.name = updateLocationDto.name;
    try {
      const entity = this.classMapper.map(updateLocationDto, UpdateLocationDto, Location);
      console.log('entity', entity);
      entity.id = id;
      const { resources } = await this.container.items.query('SELECT * from c WHERE c.id = "' + id + '"').fetchNext();
      console.log('resources', resources);
      entity.location = updateLocationDto.location;
      entity.createdAt = resources[0].createdAt;
      entity.longLang = resources[0].longLang;
      console.log('entity', entity);
      const { resource } = await this.container.item(resources[0].id, resources[0].longLang).replace(entity);
      const result = this.classMapper.map(resource, Location, ReadLocationDto);
      result.location = resource.location;
      return result;

    } catch (ex) {
      throw new Error(`Update error: ${ex.message}.`);
    }
    // return location;
  }

  async remove(id: string) {
    try {
      const { resources } = await this.container.items.query('SELECT * from c WHERE c.id = "' + id + '"').fetchNext();
      await this.container.item(resources[0].id, resources[0].longLang).delete();
      return `This action removes a ${id} location`;
    } catch (ex) {
      throw new Error(`Remove error: ${ex.message}.`);
    }
  }

  private getRandomId() {
    return uuidv4();
  }
  private generateLocationResponse(id?: string) : Location {
    const location = new Location();
    if (id == undefined) {
      location.id = this.getRandomId();
    } else {
      location.id = id;
    }
    location.location = {longitude: 51.985103, latitude: 5.898730};
    location.icon = 'cheese_wheel';
    location.createdAt = new Date();
    location.ocean = Ocean.Blue;
    location.name = 'Velperplein';
    return location;
  }

  async mockData() {
    try {
      for (const location of this.locationGenerator()) {
        location.longLang = location.ocean + location.id;
        await this.container.items.create(location);
      }
    } catch (ex) {
      throw new Error(`Remove error: ${ex.message}.`);
    }
  }

  private locationGenerator(): Location[] {
    const locations: Location[] = [
      {
        id: this.getRandomId(),
        name: 'Blue Harbor',
        location: { latitude: 52.396708, longitude: 4.8791273 },
        icon: 'toilet',
        createdAt: new Date(),
        ocean: Ocean.Blue,
      },
      {
        id: this.getRandomId(),
        name: 'Azure Port',
        location: { latitude: 52.4033065, longitude: 4.8754366 },
        icon: 'info',
        createdAt: new Date(),
        ocean: Ocean.Blue,
      },
      {
        id: this.getRandomId(),
        name: 'Sapphire Bay',
        location: { latitude: 52.4108988, longitude: 4.8740633 },
        icon: 'food',
        createdAt: new Date(),
        ocean: Ocean.Blue,
      },
      {
        id: this.getRandomId(),
        name: 'Emerald Shore',
        location: { latitude: 52.4091884, longitude: 4.8774107 },
        icon: 'drink',
        createdAt: new Date(),
        ocean: Ocean.Green,
      },
      {
        id: this.getRandomId(),
        name: 'Verdant Cove',
        location: { latitude: 52.3948399, longitude: 4.8951776 },
        icon: 'activity',
        createdAt: new Date(),
        ocean: Ocean.Green,
      },
      {
        id: this.getRandomId(),
        name: 'Snowy Haven',
        location: { latitude: 52.3987874, longitude: 4.8961067 },
        icon: 'toilet',
        createdAt: new Date(),
        ocean: Ocean.White,
      },
      {
        id: this.getRandomId(),
        name: 'Frosty Beach',
        location: { latitude: 52.3845927, longitude: 4.8994541 },
        icon: 'info',
        createdAt: new Date(),
        ocean: Ocean.White,
      },
      {
        id: this.getRandomId(),
        name: 'Iceberg Point',
        location: { latitude: 52.3964307, longitude: 4.9029732 },
        icon: 'food',
        createdAt: new Date(),
        ocean: Ocean.White,
      },
      {
        id: this.getRandomId(),
        name: 'Golden Sands',
        location: { latitude: 52.3780592, longitude: 4.8986108 },
        icon: 'drink',
        createdAt: new Date(),
        ocean: Ocean.Yellow,
      },
      {
        id: this.getRandomId(),
        name: 'Amber Cove',
        location: { latitude: 52.376435, longitude: 4.9145754 },
        icon: 'activity',
        createdAt: new Date(),
        ocean: Ocean.Yellow,
      },
      {
        id: this.getRandomId(),
        name: 'Citrine Bay',
        location: { latitude: 52.3741818, longitude: 4.9332864 },
        icon: 'toilet',
        createdAt: new Date(),
        ocean: Ocean.Yellow,
      },
      {
        id: this.getRandomId(),
        name: 'Scarlet Reef',
        location: { latitude: 52.3707233, longitude: 4.9088247 },
        icon: 'info',
        createdAt: new Date(),
        ocean: Ocean.Red,
      },
      {
        id: this.getRandomId(),
        name: 'Crimson Bay',
        location: { latitude: 52.3640675, longitude: 4.9206693 },
        icon: 'food',
        createdAt: new Date(),
        ocean: Ocean.Red,
      },
      {
        id: this.getRandomId(),
        name: 'Ruby Shore',
        location: { latitude: 52.3660591, longitude: 4.9344881 },
        icon: 'drink',
        createdAt: new Date(),
        ocean: Ocean.Red,
      },
    ];

    return locations;
  }
}
