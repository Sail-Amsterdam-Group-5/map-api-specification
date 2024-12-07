import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseArrayPipe } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';

@Controller('utilities')
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}

  @ApiCreatedResponse({description: 'This action adds a new utility',
  example: {
    "id": 88,
    "name": "Toilet Velperplein",
    "description": "This is the toilet at Velperplein which is open from 08:00 till 22:00.",
    "locationId": 1,
    "type": "toilet",
    "dates": "2021-09-15T14:00:00Z",
    "createdAt": "2024-12-07T15:38:40.318Z"
  }})
  @Post()
  create(@Body() createUtilityDto: CreateUtilityDto) {
    return this.utilitiesService.create(createUtilityDto);
  }

  @ApiOkResponse({description: 'This action returns all utilities', example:
      [
        {
          "id": 56,
          "name": "Toilet Velperplein",
          "description": "This is the toilet at Velperplein which is open from 08:00 till 22:00.",
          "locationId": 6,
          "createdAt": "2024-12-07T15:44:56.409Z",
          "type": "toilet",
          "dates": [
            "Sat Dec 07 2024",
            "Sun Dec 08 2024"
          ]
        },
        {
          "id": 85,
          "name": "Toilet Velperplein",
          "description": "This is the toilet at Velperplein which is open from 08:00 till 22:00.",
          "locationId": 79,
          "createdAt": "2024-12-07T15:44:56.409Z",
          "type": "toilet",
          "dates": [
            "Sat Dec 07 2024",
            "Sun Dec 08 2024"
          ]
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
        "locationId": 34,
        "createdAt": "2024-12-07T15:45:54.543Z",
        "type": "toilet",
        "dates": [
          "Sat Dec 07 2024",
          "Sun Dec 08 2024"
        ]
      }})
  @Get('byId/:id')
  findOne(@Param('id') id: string) {
    return this.utilitiesService.findOne(id);
  }


  @ApiOkResponse({description: 'This action returns utilities by type and/or date', example: [
      {
        "id": 1,
        "name": "Toilet Velperplein",
        "description": "This is the toilet at Velperplein which is open from 08:00 till 22:00.",
        "locationId": 1,
        "createdAt": "2024-12-07T15:49:00.316Z",
        "type": "toilet",
        "dates": [
          "Sat Dec 07 2024",
          "Sun Dec 08 2024"
        ]
      },
      {
        "id": 2,
        "name": "Toilet Velperplein",
        "description": "This is the toilet at Velperplein which is open from 08:00 till 22:00.",
        "locationId": 2,
        "createdAt": "2024-12-07T15:49:00.316Z",
        "type": "toilet",
        "dates": [
          "Sat Dec 07 2024",
          "Sun Dec 08 2024"
        ]
      }
    ]})
  @ApiQuery({name: 'Date', type: Array, required: false, default: ['2024-10-1'], description: 'The date you want to find utilities for'})
  @ApiQuery({name: 'type', type: String, required: false, default: 'Toilet', description: 'The type of utility you want to find'})
  @Get('findByTypeAndOrDate')
  findByTypeAndOrDate(@Query('Date', new ParseArrayPipe({ items: String, separator: ',', optional: true })) date?: string[], @Query('type') type?: string) {
    return this.utilitiesService.findByTypeAndOrDate(type, date);
  }

  @ApiOkResponse({description: 'This action updates a utility', example: {
      "id": 1,
      "name": "Toilet Velperplein",
      "description": "This is the toilet at Velperplein which is open from 08:00 till 22:00.",
      "locationId": 1,
      "type": "toilet",
      "dates": [
        "2021-09-15",
        "2021-09-16"
      ],
      "createdAt": "2024-12-07T15:50:48.619Z"
    }})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUtilityDto: UpdateUtilityDto) {
    return this.utilitiesService.update(id, updateUtilityDto);
  }

  @ApiOkResponse({description: 'This action removes a utility'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utilitiesService.remove(id);
  }
}
