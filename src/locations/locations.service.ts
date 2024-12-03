import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import {Utility} from "../utilities/entities/utility.entity";
import {Location} from "./entities/location.entity";

@Injectable()
export class LocationsService {
  create(createLocationDto: CreateLocationDto) {
    const location = new Location();
    location.id = this.getRandomInt(99);
    location.location = createLocationDto.location;
    location.imageURL = createLocationDto.imageURL;
    location.createdAt = new Date();
    return location;
  }

  findAll() {
    return [this.generateRandomResponse(), this.generateRandomResponse()];
  }

  findOne(id: number) {
    return this.generateRandomResponse(id)
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    const location = new Location();
    location.id = this.getRandomInt(99);
    location.location = updateLocationDto.location;
    location.imageURL = updateLocationDto.imageURL;
    location.createdAt = new Date();
    return location;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  private generateRandomResponse(id?: number) : Location {
    const location = new Location();
    if (id == undefined) {
      location.id = this.getRandomInt(99);
    } else {
      location.id = id;
    }
    location.location.longtitude = '-43.29957';
    location.location.latitude = '78.61899'
    location.imageURL = 'https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263';
    location.createdAt = new Date();
    return location;
  }
}
