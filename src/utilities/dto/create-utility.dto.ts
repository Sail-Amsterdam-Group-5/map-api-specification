import {ApiProperty} from "@nestjs/swagger";
import {Location} from "../../locations/entities/location.entity";
import {CosmosDateTime} from "@nestjs/azure-database";

export class CreateUtilityDto {
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
        example: 1,
        description: 'The id of the location'
    })
    locationId: number;

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
}
