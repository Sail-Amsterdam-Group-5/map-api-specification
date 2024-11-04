import {ApiProperty} from "@nestjs/swagger";
import {Location} from "../../locations/entities/location.entity";

export class CreateUtilityDto {
    @ApiProperty({
        example: 'Toilet Velperplein',
        description: 'The name of the utility'
    })
    title: string;
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
}
