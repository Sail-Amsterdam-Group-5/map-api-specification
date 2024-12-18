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
    return [this.generateLocationResponse(this.getRandomId()), this.generateLocationResponse(this.getRandomId())];
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
}
