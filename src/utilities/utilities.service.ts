import { Injectable } from '@nestjs/common';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import {Utility} from "./entities/utility.entity";
import { Location, Ocean } from '../locations/entities/location.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UtilitiesService {
  create(createUtilityDto: CreateUtilityDto) {
    const utility = new Utility();
    utility.id = this.getRandomId();
    utility.name = createUtilityDto.name
    utility.description = createUtilityDto.description;
    utility.location = this.generateLocationResponse(createUtilityDto.locationId);
    utility.type = createUtilityDto.type;
    utility.dates = createUtilityDto.dates;
    utility.createdAt = new Date();
    return utility;
  }

  findAll() {
    return [this.generateRandomResponse(this.getRandomId()), this.generateRandomResponse(this.getRandomId())];
  }

  findOne(id: string) {
    return this.generateRandomResponse(id);
  }

  findByTypeAndOrDate(type?: string, date?: string[]) {
    console.log(type);
    console.log(date);
    if (type == undefined || date == undefined) {
      return [this.generateRandomResponse(this.getRandomId(), this.getRandomId()), this.generateRandomResponse(this.getRandomId(), this.getRandomId())];
    } else if (date == undefined) {
      return [this.generateRandomResponse(this.getRandomId(), this.getRandomId(), type), this.generateRandomResponse(this.getRandomId(), this.getRandomId(), type)];
    } else if (type == undefined) {
      return [this.generateRandomResponse(this.getRandomId(), this.getRandomId(), undefined, date), this.generateRandomResponse(this.getRandomId(), this.getRandomId(), undefined, date)];
    } else {
      return [this.generateRandomResponse(this.getRandomId(), this.getRandomId(), type, date), this.generateRandomResponse(this.getRandomId(), this.getRandomId(), type, date)];
    }
  }

  update(id: string, updateUtilityDto: UpdateUtilityDto) {
    const utility = new Utility();
    utility.id = id
    utility.name = updateUtilityDto.name
    utility.description = updateUtilityDto.description;
    utility.location = this.generateLocationResponse(updateUtilityDto.locationId);
    utility.type = updateUtilityDto.type;
    utility.dates = updateUtilityDto.dates;
    utility.createdAt = new Date();
    return utility;
  }

  remove(id: string) {
    return `This action removes a ${id} utility`;
  }

  private getRandomId() {
    return uuidv4();
  }
  private generateRandomResponse(id?: string, locationId?: string, type?: string, dates?: string[]) : Utility {
    const utility = new Utility();
    if (id == undefined) {
      utility.id = this.getRandomId()
    } else {
      utility.id = id;
    }
    utility.name = 'Toilet Velperplein';
    utility.description = 'This is the toilet at Velperplein which is open from 08:00 till 22:00.';
    if (locationId == undefined) {
      utility.location = this.generateLocationResponse();
    } else {
        utility.location = this.generateLocationResponse(locationId);
    }
    utility.createdAt = new Date();
    if (type == undefined) {
      utility.type = 'toilet';
    } else {
      utility.type = type;
    }
    if (dates == undefined) {
      const date = new Date("2025-08-20").setDate(new Date("2025-08-20").getDate() + 1);
      utility.dates = [new Date("2025-08-20").toDateString(), new Date(date).toDateString()];
    } else {
      console.log(dates);
      utility.dates = []
      dates.forEach(date => {
        console.log(date);
        console.log(utility.dates);
        utility.dates.push(date);
      })
    }
    return utility;
  }

  private generateLocationResponse(id?: string) : Location {
    const location = new Location();
    if (id == undefined) {
      location.id = this.getRandomId()
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
