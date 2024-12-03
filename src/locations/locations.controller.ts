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
        "id": 55,
        "location": "-43.29957, 78.61899",
        "imageURL": "https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263",
        "createdAt": "2024-11-26T13:17:25.399Z"
      }})
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @ApiOkResponse({description: 'This action returns all locations', example:
      [
        {
          "id": 50,
          "location": "-43.29957, 78.61899",
          "imageURL": "https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263",
          "createdAt": "2024-11-26T13:17:52.478Z"
        },
        {
          "id": 89,
          "location": "-43.29957, 78.61899",
          "imageURL": "https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263",
          "createdAt": "2024-11-26T13:17:52.478Z"
        }
      ]})
  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @ApiOkResponse({description: 'This action returns a location', example:
      {
        "id": 1,
        "location": "-43.29957, 78.61899",
        "imageURL": "https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263",
        "createdAt": "2024-11-26T13:18:15.013Z"
      }})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(+id);
  }


  @ApiOkResponse({description: 'This action updates a location', example:
      {
        "id": 48,
        "location": "-43.29957, 78.61899",
        "imageURL": "https://cdn.nextgov.com/media/img/cd/2017/05/03/050317sharkNG/route-fifty-lead-image.jpg?1627512263",
        "createdAt": "2024-11-26T13:18:33.036Z"
      }})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(+id, updateLocationDto);
  }

  @ApiOkResponse({description: 'This action removes a location'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationsService.remove(+id);
  }
}
