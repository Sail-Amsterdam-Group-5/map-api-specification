import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location, Ocean } from './entities/location.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LocationsService {
  create(createLocationDto: CreateLocationDto) {
    const location = new Location();
    location.id = this.getRandomId();
    location.location = createLocationDto.location;
    location.icon = createLocationDto.icon;
    location.createdAt = new Date();
    location.ocean = createLocationDto.ocean;
    location.name = createLocationDto.name;
    return location;
  }

  findAll() {
    return this.locationGenerator();
  }

  findOne(id: string) {
    return this.generateLocationResponse(id)
  }

  update(id: string, updateLocationDto: UpdateLocationDto) {
    const location = new Location();
    location.id = id;
    location.location = updateLocationDto.location;
    location.icon = updateLocationDto.icon;
    location.createdAt = new Date();
    location.ocean = updateLocationDto.ocean;
    location.name = updateLocationDto.name;
    return location;
  }

  remove(id: string) {
    return `This action removes a ${id} location`;
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
