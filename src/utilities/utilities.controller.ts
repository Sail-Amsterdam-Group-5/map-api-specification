import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, Query, ParseArrayPipe } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOAuth2, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ByTypeAndOrDateDto } from './dto/byTypeAndOrDate.dto';

@Controller('utilities')
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}

  @ApiCreatedResponse({description: 'This action adds a new utility',
  example: {"id": 70,
    "name": "Toilet Velperplein",
    "description": "This is the toilet at Velperplein which is open from 08:00 till 22:00.",
    "locationId": 1,
    "type": "toilet"}})
  @Post()
  create(@Body() createUtilityDto: CreateUtilityDto) {
    return this.utilitiesService.create(createUtilityDto);
  }

  @ApiOkResponse({description: 'This action returns all utilities', example:
      [
        {
          "id": 2,
          "name": "Toilet Velperplein",
          "description": "This is the toilet at Velperplein which is open from 08:00 till 22:00.",
          "locationId": 14,
          "createdAt": "2024-11-26T12:47:24.371Z",
          "type": "toilet"
        },
        {
          "id": 58,
          "name": "Toilet Velperplein",
          "description": "This is the toilet at Velperplein which is open from 08:00 till 22:00.",
          "locationId": 46,
          "createdAt": "2024-11-26T12:47:24.371Z",
          "type": "toilet"
        }
      ]})
  @Get()
  findAll() {
    return this.utilitiesService.findAll();
  }

  @ApiOkResponse({description: 'This action returns a utility', example:
      {
        "id": 1,
        "name": "Toilet Velperplein",
        "description": "This is the toilet at Velperplein which is open from 08:00 till 22:00.",
        "locationId": 41,
        "createdAt": "2024-11-26T13:15:11.710Z",
        "type": "toilet"
      }})
  @Get('byId/:id')
  findOne(@Param('id') id: string) {
    return this.utilitiesService.findOne(+id);
  }


  @ApiOkResponse({description: 'This action returns utilities by type and/or date', example: [
      {
        "id": 1,
        "name": "Toilet Velperplein",
        "description": "This is the toilet at Velperplein which is open from 08:00 till 22:00.",
        "locationId": 1,
        "createdAt": "2024-11-28T10:59:43.151Z",
        "type": "Toilet",
        "dates": [
          "2024-10-1"
        ]
      },
      {
        "id": 2,
        "name": "Toilet Velperplein",
        "description": "This is the toilet at Velperplein which is open from 08:00 till 22:00.",
        "locationId": 2,
        "createdAt": "2024-11-28T10:59:43.151Z",
        "type": "Toilet",
        "dates": [
          "2024-10-1"
        ]
      }
    ]})
  @ApiQuery({name: 'Date', type: Array, required: false, default: ['2024-10-1'], description: 'The date you want to find utilities for'})
  @ApiQuery({name: 'type', type: String, required: false, default: 'Toilet', description: 'The type of utility you want to find'})
  @Get('findByTypeAndOrDate')
  findByTypeAndOrDate(@Query('Date', new ParseArrayPipe({ items: String, separator: ',' })) date?: string[], @Query('type') type?: string) {
    return this.utilitiesService.findByTypeAndOrDate(type, date);
  }

  @ApiOkResponse({description: 'This action updates a utility', example: {
      "id": 1,
      "name": "Toilet Velperplein",
      "description": "This is the toilet at Velperplein which is open from 08:00 till 22:00.",
      "locationId": 1,
      "type": "No Toilet",
      "createdAt": "2024-11-26T13:16:15.776Z"
    }})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUtilityDto: UpdateUtilityDto) {
    return this.utilitiesService.update(+id, updateUtilityDto);
  }

  @ApiOkResponse({description: 'This action removes a utility'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return;
  }
}
