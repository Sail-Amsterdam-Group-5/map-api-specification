import {ApiProperty} from "@nestjs/swagger";
import { Ocean } from '../entities/location.entity';

export class CreateLocationDto {
    @ApiProperty({
        example: 'Velperplein',
        description: 'The name of the location'
    })
    name: string;

    @ApiProperty({
        example: {longtitude: 51.985103, latitude: 5.898730},
        description: 'The location'
    })
    location: {
        longitude: number,
        latitude: number
    }
    @ApiProperty({
        example: 'cheese_wheel',
        description: 'The name of an icon'
    })
    icon: string;

    // Ocean Red, Green, Yellow, Blue, White, Gray
    @ApiProperty({ enum: ['Red', 'Green', 'Yellow', 'Blue', 'White', 'Gray'], example: 'Red' })
    ocean: Ocean;
}
