import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, ignore, mapFrom, Mapper } from '@automapper/core';
import { Location } from '../locations/entities/location.entity';
import { CreateLocationDto } from '../locations/dto/create-location.dto';
import { UpdateLocationDto } from '../locations/dto/update-location.dto';
import { v4 as uuidv4 } from 'uuid';
import { ReadLocationDto } from '../locations/dto/read-location.dto';

@Injectable()
export class LocationsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Location, ReadLocationDto);
      createMap(mapper, CreateLocationDto, Location,
        forMember((dest) => dest.id, ignore()),
        forMember((dest) => dest.createdAt, ignore()),
        forMember((dest) => dest.location, mapFrom((src) => {
        return src.location;
        })),
        forMember((dest) => dest.id, mapFrom((src) => {
          return uuidv4();
        })),
      )
      createMap(mapper, UpdateLocationDto, Location,
        forMember((dest) => dest.id, ignore()),
        forMember((dest) => dest.createdAt, ignore()),
        forMember((dest) => dest.location, mapFrom((src) => {
          return src.location;
        })),);
    };
  }
}