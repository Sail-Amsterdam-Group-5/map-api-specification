import {ApiProperty} from "@nestjs/swagger";
import { AutoMap } from '@automapper/classes';
import { CosmosDateTime } from '@nestjs/azure-database';
import { Location } from '../../locations/entities/location.entity';

export class ReadUtilityDto {
    @AutoMap()
    @ApiProperty({
        example: '8476f4dc-eefe-458f-9c1d-a849c46da56b',
        description: 'The id of the utility',
    })
    id?: string;
    
    @AutoMap()
    @ApiProperty({
        example: 'Toilet Velperplein',
        description: 'The name of the utility'
    })
    name: string;

    @AutoMap()
    @ApiProperty({
        example: 'This is the toilet at Velperplein which is open from 08:00 till 22:00.',
        description: 'The description of the utility'
    })
    description: string;

    @AutoMap()
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

    @AutoMap()
    @ApiProperty({
        description: "The dates the utility is available",
        example: ["2025-08-20", '2025-08-21', '2025-08-22', '2025-08-23', '2025-08-24']
    })
    dates: string[];

    @AutoMap()
    @ApiProperty({
        example: "toilet",
        description: 'The type of utility'
    })
    type: string;

    @AutoMap()
    @CosmosDateTime() createdAt?: Date;
}
