import {ApiProperty} from "@nestjs/swagger";
import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';
import { AutoMap } from '@automapper/classes';

@CosmosPartitionKey('location')
export class Location {
    @AutoMap()
    @ApiProperty({
        example: '8476f4dc-eefe-458f-9c1d-a849c46da56b',
        description: 'The id of the location',
    })
    id: string;

    // Name
    @AutoMap()
    @ApiProperty({
        example: 'Velperplein',
        description: 'The name of the location'
    })
    name: string;

    @AutoMap()
    longLang?: string;

    @AutoMap()
    @ApiProperty({
        example: {longtitude: 51.985103, latitude: 5.898730},
        description: 'The location'
    })
    location: {
        longitude: number,
        latitude: number
    }

    // Change to Icon. string
    @AutoMap()
    @ApiProperty({
        example: 'cheese_wheel',
        description: 'The name of an icon'
    })
    icon: string;

    @AutoMap()
    @ApiProperty({
        example: '2021-09-15T14:00:00Z',
        description: 'The date and time the location was created'
    })
    @CosmosDateTime() createdAt?: Date;

    @AutoMap()
    // Ocean Red, Green, Yellow, Blue, White, Gray
    @ApiProperty({ enum: ['Red', 'Green', 'Yellow', 'Blue', 'White', 'Gray'], example: 'Red' })
    ocean: Ocean;
}

export enum Ocean { Red= 'Red', Green= 'Green', Yellow= 'Yellow', Blue= 'Blue', White= 'White', Gray= 'Gray' }
