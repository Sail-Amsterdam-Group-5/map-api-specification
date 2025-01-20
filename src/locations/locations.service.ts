import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location, Ocean } from './entities/location.entity';
import { v4 as uuidv4 } from 'uuid';
import { Container, CosmosClient } from '@azure/cosmos';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ConfigService } from '@nestjs/config';
import { ReadLocationDto } from './dto/read-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    private configService: ConfigService,
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
    'LOCATION_CONTAINER_ID',
  );
  private container: Container;

  async create(createLocationDto: CreateLocationDto) {
    try {
      const entity = this.classMapper.map(
        createLocationDto,
        CreateLocationDto,
        Location,
      );
      entity.longLang = entity.ocean + entity.id;
      entity.createdAt = new Date();
      const { resource } = await this.container.items.create(entity);
      const result = this.classMapper.map(resource, Location, ReadLocationDto);
      result.location = resource.location;
      return result;
    } catch (ex) {
      throw new Error(`Create error: ${ex.message}.`);
    }
  }

  async findAll() {
    try {
      const { resources } = await this.container.items
        .query('SELECT * from c')
        .fetchAll();
      return resources.map((resource) => {
        const result = this.classMapper.map(
          resource,
          Location,
          ReadLocationDto,
        );
        result.location = resource.location;
        return result;
      });
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
        throw new Error(`Location with id ${id} not found.`);
      }
      const result = this.classMapper.map(
        resources[0],
        Location,
        ReadLocationDto,
      );
      result.location = resources[0].location;
      return result;
    } catch (ex) {
      throw new HttpException(
        `Find one error: ${ex.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    try {
      const entity = this.classMapper.map(
        updateLocationDto,
        UpdateLocationDto,
        Location,
      );
      entity.id = id;
      const { resources } = await this.container.items
        .query('SELECT * from c WHERE c.id = "' + id + '"')
        .fetchNext();
      entity.location = updateLocationDto.location;
      entity.createdAt = resources[0].createdAt;
      entity.longLang = resources[0].longLang;
      const { resource } = await this.container
        .item(resources[0].id, resources[0].longLang)
        .replace(entity);
      const result = this.classMapper.map(resource, Location, ReadLocationDto);
      result.location = resource.location;
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
      await this.container
        .item(resources[0].id, resources[0].longLang)
        .delete();
      return `This action removes a ${id} location`;
    } catch (ex) {
      throw new Error(`Remove error: ${ex.message}.`);
    }
  }

  private getRandomId() {
    return uuidv4();
  }

  async mockData() {
    try {
      for (const location of this.locationGenerator()) {
        location.longLang = location.ocean + location.id;
        await this.container.items.create(location);
      }
    } catch (ex) {
      throw new Error(`Mock error: ${ex.message}.`);
    }
  }

  private locationGenerator(): Location[] {
    const locations: Location[] = [
      {
        id: this.getRandomId(),
        name: 'Blue Harbor',
        location: { latitude: 52.3995, longitude: 4.8702 },
        icon: 'toilet',
        createdAt: new Date(),
        ocean: Ocean.Blue,
      },
      {
        id: this.getRandomId(),
        name: 'Azure Port',
        location: { latitude: 52.4058, longitude: 4.8762 },
        icon: 'info',
        createdAt: new Date(),
        ocean: Ocean.Blue,
      },
      {
        id: this.getRandomId(),
        name: 'Sapphire Bay',
        location: { latitude: 52.4085, longitude: 4.8725 },
        icon: 'food',
        createdAt: new Date(),
        ocean: Ocean.Blue,
      },
      {
        id: this.getRandomId(),
        name: 'Emerald Shore',
        location: { latitude: 52.4011, longitude: 4.89 },
        icon: 'drink',
        createdAt: new Date(),
        ocean: Ocean.Green,
      },
      {
        id: this.getRandomId(),
        name: 'Verdant Cove',
        location: { latitude: 52.4039, longitude: 4.8868 },
        icon: 'activity',
        createdAt: new Date(),
        ocean: Ocean.Green,
      },
      {
        id: this.getRandomId(),
        name: 'Snowy Haven',
        location: { latitude: 52.3912, longitude: 4.9003 },
        icon: 'toilet',
        createdAt: new Date(),
        ocean: Ocean.White,
      },
      {
        id: this.getRandomId(),
        name: 'Frosty Beach',
        location: { latitude: 52.3868, longitude: 4.905 },
        icon: 'info',
        createdAt: new Date(),
        ocean: Ocean.White,
      },
      {
        id: this.getRandomId(),
        name: 'Iceberg Point',
        location: { latitude: 52.3894, longitude: 4.9001 },
        icon: 'food',
        createdAt: new Date(),
        ocean: Ocean.White,
      },
      {
        id: this.getRandomId(),
        name: 'Golden Sands',
        location: { latitude: 52.3806, longitude: 4.9201 },
        icon: 'drink',
        createdAt: new Date(),
        ocean: Ocean.Yellow,
      },
      {
        id: this.getRandomId(),
        name: 'Amber Cove',
        location: { latitude: 52.3788, longitude: 4.9153 },
        icon: 'activity',
        createdAt: new Date(),
        ocean: Ocean.Yellow,
      },
      {
        id: this.getRandomId(),
        name: 'Citrine Bay',
        location: { latitude: 52.3769, longitude: 4.93 },
        icon: 'toilet',
        createdAt: new Date(),
        ocean: Ocean.Yellow,
      },
      {
        id: this.getRandomId(),
        name: 'Scarlet Reef',
        location: { latitude: 52.369, longitude: 4.9201 },
        icon: 'info',
        createdAt: new Date(),
        ocean: Ocean.Red,
      },
      {
        id: this.getRandomId(),
        name: 'Crimson Bay',
        location: { latitude: 52.3678, longitude: 4.9263 },
        icon: 'food',
        createdAt: new Date(),
        ocean: Ocean.Red,
      },
      {
        id: this.getRandomId(),
        name: 'Ruby Shore',
        location: { latitude: 52.3715, longitude: 4.9295 },
        icon: 'drink',
        createdAt: new Date(),
        ocean: Ocean.Red,
      },
      {
        id: this.getRandomId(),
        name: 'Ruby Cove',
        location: { latitude: 52.369, longitude: 4.9279 },
        icon: 'activity',
        createdAt: new Date(),
        ocean: Ocean.Red,
      },
    ];

    return locations;
  }
}
