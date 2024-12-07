import {Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import {ApiCreatedResponse, ApiOkResponse} from "@nestjs/swagger";

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @ApiCreatedResponse({description: 'This action adds a new location', example:
      {
        "id": 5,
        "location": {
          "longtitude": "51.985103",
          "latitude": "5.898730"
        },
        "imageURL": "https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263",
        "createdAt": "2024-12-07T15:52:55.308Z"
      }})
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @ApiOkResponse({description: 'This action returns all locations', example:
      [
        {
          "id": 49,
          "location": {
            "longitude": "51.985103",
            "latitude": "5.898730"
          },
          "imageURL": "https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263",
          "createdAt": "2024-12-07T15:55:29.303Z"
        },
        {
          "id": 40,
          "location": {
            "longitude": "51.985103",
            "latitude": "5.898730"
          },
          "imageURL": "https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263",
          "createdAt": "2024-12-07T15:55:29.303Z"
        }
      ]})
  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @ApiOkResponse({description: 'This action returns a location', example:
      {
        "id": 1,
        "location": {
          "longitude": "51.985103",
          "latitude": "5.898730"
        },
        "imageURL": "https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263",
        "createdAt": "2024-12-07T15:55:54.943Z"
      }})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id);
  }


  @ApiOkResponse({description: 'This action updates a location', example:
      {
        "id": 75,
        "location": {
          "longtitude": "51.985103",
          "latitude": "5.898730"
        },
        "imageURL": "https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263",
        "createdAt": "2024-12-07T15:56:09.504Z"
      }})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @ApiOkResponse({description: 'This action removes a location'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationsService.remove(id);
  }
}
