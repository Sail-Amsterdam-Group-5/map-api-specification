import {ApiProperty} from "@nestjs/swagger";
import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

@CosmosPartitionKey('location')
export class Location {
    @ApiProperty({
        example: '1',
        description: 'The id of the location',
    })
    id: string;
    @ApiProperty({
        example: {longtitude: "51.985103", latitude: "5.898730"},
        description: 'The location'
    })
    location: {
        longitude: string,
        latitude: string
    }
    @ApiProperty({
        example: 'https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263',
        description: 'The url of an image'
    })
    imageURL: string;

    @ApiProperty({
        example: '2021-09-15T14:00:00Z',
        description: 'The date and time the location was created'
    })
    @CosmosDateTime() createdAt: Date;
}
