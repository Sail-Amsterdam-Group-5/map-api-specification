import {ApiProperty} from "@nestjs/swagger";
import {CosmosDateTime, CosmosPartitionKey} from "@nestjs/azure-database";
import { Location } from '../../locations/entities/location.entity';

@CosmosPartitionKey('type')
export class Utility {
    @ApiProperty({
        example: '8476f4dc-eefe-458f-9c1d-a849c46da56b',
        description: 'The id of the utility',
    })
    id?: string;
    @ApiProperty({
        example: 'Toilet Velperplein',
        description: 'The name of the utility'
    })
    name: string;
    @ApiProperty({
        example: 'This is the toilet at Velperplein which is open from 08:00 till 22:00.',
        description: 'The description of the utility'
    })
    description: string;

    @ApiProperty({
        example: {
            "id": "9a83312e-9a65-4f70-828f-9c42655b0f60",
            "location": {
                "longtitude": 51.985103,
                "latitude": 5.89873
            },
            "icon": "cheese_wheel",
            "createdAt": "2024-12-18T12:53:05.282Z",
            "ocean": "Red",
            "name": "Velperplein"
        },
        description: 'The location object'
    })
    location: Location;

    @ApiProperty({
        description: "The dates the utility is available",
        example: ["2021-09-15", '2021-09-16']
    })
    dates: string[];

    @ApiProperty({
        example: "toilet",
        description: 'The type of utility'
    })
    type: string;

    @CosmosDateTime() createdAt: Date;
}

