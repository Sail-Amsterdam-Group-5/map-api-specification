import { Injectable } from '@nestjs/common';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import {Utility} from "./entities/utility.entity";

@Injectable()
export class UtilitiesService {
  create(createUtilityDto: CreateUtilityDto) {
    const utility = new Utility();
    utility.id = this.getRandomInt(99);
    utility.title = createUtilityDto.title
    utility.description = createUtilityDto.description;
    utility.locationId = createUtilityDto.locationId;
    return utility;
  }

  findAll() {
    return [this.generateRandomResponse(), this.generateRandomResponse()];
  }

  findOne(id: number) {
    return this.generateRandomResponse(id);
  }

  update(id: number, updateUtilityDto: UpdateUtilityDto) {
    const utility = new Utility();
    utility.id = id
    utility.title = updateUtilityDto.title
    utility.description = updateUtilityDto.description;
    utility.locationId = updateUtilityDto.locationId;
    return utility;;
  }

  remove(id: number) {
    return `This action removes a ${id} utility`;
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  private generateRandomResponse(id?: number, locationId?: number) : Utility {
    const utility = new Utility();
    if (id == undefined) {
      utility.id = this.getRandomInt(99);
    } else {
      utility.id = id;
    }
    utility.title = 'Toilet Velperplein';
    utility.description = 'This is the toilet at Velperplein which is open from 08:00 till 22:00.';
    if (locationId == undefined) {
      utility.locationId = this.getRandomInt(99);
    } else {
        utility.locationId = locationId;
    }
    return utility;
  }
}
