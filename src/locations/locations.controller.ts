import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import {ApiCreatedResponse, ApiOkResponse} from "@nestjs/swagger";

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @ApiCreatedResponse({description: 'This action adds a new location'})
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @ApiOkResponse({description: 'This action returns all locations'})
  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @ApiOkResponse({description: 'This action returns a location'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(+id);
  }

  @ApiOkResponse({description: 'This action updates a location'})
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
