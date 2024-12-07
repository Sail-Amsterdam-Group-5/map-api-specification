import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import {Location} from "./entities/location.entity";

@Injectable()
export class LocationsService {
  create(createLocationDto: CreateLocationDto) {
    const location = new Location();
    location.id = '1';
    location.location = createLocationDto.location;
    location.imageURL = createLocationDto.imageURL;
    location.createdAt = new Date();
    return location;
  }

  findAll() {
    return [this.generateRandomResponse('1'), this.generateRandomResponse('2')];
  }

  findOne(id: string) {
    return this.generateRandomResponse(id)
  }

  update(id: string, updateLocationDto: UpdateLocationDto) {
    const location = new Location();
    location.id = id;
    location.location = updateLocationDto.location;
    location.imageURL = updateLocationDto.imageURL;
    location.createdAt = new Date();
    return location;
  }

  remove(id: string) {
    return `This action removes a #${id} location`;
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  private generateRandomResponse(id?: string) : Location {
    const location = new Location();
    if (id == undefined) {
      location.id = this.getRandomInt(99).toString();
    } else {
      location.id = id;
    }
    location.location = {longitude: '51.985103', latitude: '5.898730'};
    location.imageURL = 'https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263';
    location.createdAt = new Date();
    return location;
  }
}
