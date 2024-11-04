import {ApiProperty} from "@nestjs/swagger";

export class CreateLocationDto {
    @ApiProperty({
        example: '-43.29957, 78.61899',
        description: 'Coordinates of the location'
    })
    location: string;
    @ApiProperty({
        example: 'https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263',
        description: 'The url of an image'
    })
    imageURL: string;
}
