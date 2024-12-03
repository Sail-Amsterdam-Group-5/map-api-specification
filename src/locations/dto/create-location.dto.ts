import {ApiProperty} from "@nestjs/swagger";

export class CreateLocationDto {
    @ApiProperty({
        example: {longtitude: "51.985103", latitude: "5.898730"},
        description: 'Coordinates of the location'
    })
    location: {
        longtitude: string,
        latitude: string
    }
    @ApiProperty({
        example: 'https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263',
        description: 'The url of an image'
    })
    imageURL: string;
}
