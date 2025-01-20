// {
//   "id": "9a83312e-9a65-4f70-828f-9c42655b0f60",
//   "location": {
//   "longtitude": 51.985103,
//     "latitude": 5.89873
// },
//   "icon": "cheese_wheel",
//   "createdAt": "2024-12-18T12:53:05.282Z",
//   "ocean": "Red",
//   "name": "Velperplein"
// }

import { ApiProperty } from '@nestjs/swagger';
import { Ocean } from '../entities/location.entity';
import { AutoMap } from '@automapper/classes';
import { CosmosDateTime } from '@nestjs/azure-database';

export class ReadLocationDto {
  @AutoMap()
  @ApiProperty({
    example: '8476f4dc-eefe-458f-9c1d-a849c46da56b',
    description: 'The id of the location',
  })
  id: string;

  @AutoMap()
  @ApiProperty({
    example: 'Velperplein',
    description: 'The name of the location',
  })
  name: string;

  @AutoMap()
  @ApiProperty({
    example: { longtitude: 51.985103, latitude: 5.89873 },
    description: 'The location',
  })
  location: {
    longitude: number;
    latitude: number;
  };

  @AutoMap()
  @ApiProperty({
    example: 'cheese_wheel',
    description: 'The name of an icon',
  })
  icon: string;

  @AutoMap()
  @ApiProperty({
    example: '2021-09-15T14:00:00Z',
    description: 'The date and time the location was created',
  })
  @CosmosDateTime()
  createdAt?: Date;

  @AutoMap()
  @ApiProperty({
    enum: ['Red', 'Green', 'Yellow', 'Blue', 'White', 'Gray'],
    example: 'Red',
  })
  ocean: Ocean;
}
