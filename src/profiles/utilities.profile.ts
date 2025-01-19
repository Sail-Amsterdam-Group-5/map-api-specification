import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, ignore, mapFrom, Mapper } from '@automapper/core';
import { Location } from '../locations/entities/location.entity';
import { CreateLocationDto } from '../locations/dto/create-location.dto';
import { UpdateLocationDto } from '../locations/dto/update-location.dto';
import { v4 as uuidv4 } from 'uuid';
import { ReadLocationDto } from '../locations/dto/read-location.dto';
import { CreateUtilityDto } from '../utilities/dto/create-utility.dto';
import { Utility } from '../utilities/entities/utility.entity';
import { UpdateUtilityDto } from '../utilities/dto/update-utility.dto';
import { ReadUtilityDto } from '../utilities/dto/read-utility.dto';

@Injectable()
export class UtilitiesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Utility, ReadUtilityDto);
      createMap(mapper, CreateUtilityDto, Utility,
        forMember((dest) => dest.id, ignore()),
        forMember((dest) => dest.createdAt, mapFrom(() => {
          return new Date();
        })),
        forMember((dest) => dest.id, mapFrom(() => {
          return uuidv4();
        })),
        forMember((dest) => dest.location, ignore()),
      );
      createMap(mapper, UpdateUtilityDto, Utility,
        forMember((dest) => dest.id, ignore()),
        forMember((dest) => dest.createdAt, ignore()),
      );
    };
  }
}