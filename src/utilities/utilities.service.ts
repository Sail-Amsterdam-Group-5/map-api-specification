import { Injectable } from '@nestjs/common';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import {Utility} from "./entities/utility.entity";

@Injectable()
export class UtilitiesService {
  create(createUtilityDto: CreateUtilityDto) {
    const utility = new Utility();
    utility.id = this.getRandomInt(99);
    utility.name = createUtilityDto.name
    utility.description = createUtilityDto.description;
    utility.locationId = createUtilityDto.locationId;
    utility.type = createUtilityDto.type;
    utility.dates = createUtilityDto.dates;
    utility.createdAt = new Date();
    return utility;
  }

  findAll() {
    return [this.generateRandomResponse(), this.generateRandomResponse()];
  }

  findOne(id: number) {
    return this.generateRandomResponse(id);
  }

  findByTypeAndOrDate(type?: string, date?: string[]) {
    if (type == undefined || date == undefined) {
      return [this.generateRandomResponse(1, 1), this.generateRandomResponse(2, 2)];
    } else if (date == undefined) {
      return [this.generateRandomResponse(1, 1, type), this.generateRandomResponse(2, 2, type)];
    } else if (type == undefined) {
      return [this.generateRandomResponse(1, 1, undefined, date), this.generateRandomResponse(2, 2, undefined, date)];
    }
    return [this.generateRandomResponse(1, 1, type, date), this.generateRandomResponse(2, 2, type, date)];
  }

  update(id: number, updateUtilityDto: UpdateUtilityDto) {
    const utility = new Utility();
    utility.id = id
    utility.name = updateUtilityDto.name
    utility.description = updateUtilityDto.description;
    utility.locationId = updateUtilityDto.locationId;
    utility.type = updateUtilityDto.type;
    utility.dates = updateUtilityDto.dates;
    utility.createdAt = new Date();
    return utility;;
  }

  remove(id: number) {
    return `This action removes a ${id} utility`;
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  private generateRandomResponse(id?: number, locationId?: number, type?: string, dates?: string[]) : Utility {
    const utility = new Utility();
    if (id == undefined) {
      utility.id = this.getRandomInt(99);
    } else {
      utility.id = id;
    }
    utility.name = 'Toilet Velperplein';
    utility.description = 'This is the toilet at Velperplein which is open from 08:00 till 22:00.';
    if (locationId == undefined) {
      utility.locationId = this.getRandomInt(99);
    } else {
        utility.locationId = locationId;
    }
    utility.createdAt = new Date();
    if (type == undefined) {
      utility.type = 'toilet';
    } else {
      utility.type = type;
    }
    if (dates == undefined) {
      utility.dates = [new Date().toDateString(), new Date().toDateString()];
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
}
