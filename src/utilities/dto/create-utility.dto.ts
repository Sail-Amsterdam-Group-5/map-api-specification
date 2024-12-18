import {ApiProperty} from "@nestjs/swagger";

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
        example: '9a83312e-9a65-4f70-828f-9c42655b0f60',
        description: 'The id of the location'
    })
    locationId: string;

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
