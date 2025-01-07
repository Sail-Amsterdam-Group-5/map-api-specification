import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiCreatedResponse, ApiHeader, ApiOkResponse } from '@nestjs/swagger';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @ApiCreatedResponse({description: 'This action adds a new location', example:
      {
        "id": "9a83312e-9a65-4f70-828f-9c42655b0f60",
        "location": {
          "longtitude": 51.985103,
          "latitude": 5.89873
        },
        "icon": "cheese_wheel",
        "createdAt": "2024-12-18T12:53:05.282Z",
        "ocean": "Red",
        "name": "Velperplein"
      }})
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }
// hey i wanna die
  @ApiOkResponse({description: 'This action returns all locations', example:
      [
        {
          "id": "8476f4dc-eefe-458f-9c1d-a849c46da56b",
          "location": {
            "longitude": 51.985103,
            "latitude": 5.89873
          },
          "icon": "cheese_wheel",
          "createdAt": "2024-12-18T12:53:23.560Z",
          "ocean": "Blue",
          "name": "Velperplein"
        },
        {
          "id": "950bbdf6-32aa-4da7-b34d-83a953fb25c4",
          "location": {
            "longitude": 51.985103,
            "latitude": 5.89873
          },
          "icon": "cheese_wheel",
          "createdAt": "2024-12-18T12:53:23.560Z",
          "ocean": "Blue",
          "name": "Velperplein"
        }
      ]})
  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  // @ApiOkResponse({description: 'This action returns a location', example:
  //     {
  //       "id": "1dafsf3",
  //       "location": {
  //         "longitude": 51.985103,
  //         "latitude": 5.89873
  //       },
  //       "icon": "cheese_wheel",
  //       "createdAt": "2024-12-18T12:53:39.624Z",
  //       "ocean": "Blue",
  //       "name": "Velperplein"
  //     }})
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.locationsService.findOne(id);
  // }


  @ApiOkResponse({description: 'This action updates a location', example:
      {
        "id": "14124",
        "location": {
          "longtitude": 51.985103,
          "latitude": 5.89873
        },
        "icon": "cheese_wheel",
        "createdAt": "2024-12-18T12:53:53.526Z",
        "ocean": "Red",
        "name": "Velperplein"
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

  @ApiHeader({
    name: 'X-User-Roles',
    description: 'Roles of the user',
  })
  @Get('headers')
  getHeaders(@Headers("X-User-Roles") headers) {
    return headers;
  }
}