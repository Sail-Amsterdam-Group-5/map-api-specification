import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLocationDto } from './create-location.dto';
import { AutoMap } from '@automapper/classes';
import { Ocean } from '../entities/location.entity';

export class UpdateLocationDto {
  @AutoMap()
  @ApiProperty({
    example: 'Velperplein',
    description: 'The name of the location'
  })
  name: string;

  @AutoMap()
  @ApiProperty({
    example: {longtitude: 51.985103, latitude: 5.898730},
    description: 'The location'
  })
  location: {
    longitude: number,
    latitude: number
  }

  @AutoMap()
  @ApiProperty({
    example: 'cheese_wheel',
    description: 'The name of an icon'
  })
  icon: string;

  @AutoMap()
  @ApiProperty({ enum: ['Red', 'Green', 'Yellow', 'Blue', 'White', 'Gray'], example: 'Red' })
  ocean: Ocean;
}
