import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';

@Controller('utilities')
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}

  @ApiCreatedResponse({
    description: 'This action adds a new utility',
    example: {
      id: 'ec522b11-d5da-4051-a433-7d58ce506f69',
      name: 'Toilet Velperplein',
      description:
        'This is the toilet at Velperplein which is open from 08:00 till 22:00.',
      location: {
        id: '7466ed11-be9d-45c4-966c-588874bbdd8a',
        location: {
          longitude: 51.985103,
          latitude: 5.89873,
        },
        icon: 'cheese_wheel',
        createdAt: '2024-12-18T12:47:22.499Z',
        ocean: 'Blue',
        name: 'Velperplein',
      },
      createdAt: '2024-12-18T12:47:22.499Z',
      type: 'toilet',
      dates: ['Wed Dec 18 2024', 'Thu Dec 19 2024'],
    },
  })
  @Post()
  create(@Body() createUtilityDto: CreateUtilityDto) {
    return this.utilitiesService.create(createUtilityDto);
  }

  @ApiOkResponse({
    description: 'This action returns all utilities',
    example: [
      {
        id: '00d39c42-208d-4a49-8980-05b5e647f7f1',
        name: 'Toilet Velperplein',
        description:
          'This is the toilet at Velperplein which is open from 08:00 till 22:00.',
        location: {
          id: '56e1eb5f-661a-4ff9-a2d7-b6931796f793',
          location: {
            longitude: 51.985103,
            latitude: 5.89873,
          },
          icon: 'cheese_wheel',
          createdAt: '2024-12-18T12:49:48.147Z',
          ocean: 'Blue',
          name: 'Velperplein',
        },
        createdAt: '2024-12-18T12:49:48.147Z',
        type: 'toilet',
        dates: ['Wed Dec 18 2024', 'Thu Dec 19 2024'],
      },
      {
        id: '8142cfac-df26-4aad-9e55-59f10dc96d49',
        name: 'Toilet Velperplein',
        description:
          'This is the toilet at Velperplein which is open from 08:00 till 22:00.',
        location: {
          id: 'f8590deb-7af3-4d45-9a92-553949b2d041',
          location: {
            longitude: 51.985103,
            latitude: 5.89873,
          },
          icon: 'cheese_wheel',
          createdAt: '2024-12-18T12:49:48.147Z',
          ocean: 'Blue',
          name: 'Velperplein',
        },
        createdAt: '2024-12-18T12:49:48.147Z',
        type: 'toilet',
        dates: ['Wed Dec 18 2024', 'Thu Dec 19 2024'],
      },
    ],
  })
  @Get()
  findAll() {
    return this.utilitiesService.findAll();
  }

  @ApiOkResponse({
    description: 'This action returns a utility',
    example: {
      id: 'a3311',
      name: 'Toilet Velperplein',
      description:
        'This is the toilet at Velperplein which is open from 08:00 till 22:00.',
      location: {
        id: 'b03d6e3a-e0f8-4b49-9f21-01c9f63a5fb6',
        location: {
          longitude: 51.985103,
          latitude: 5.89873,
        },
        icon: 'cheese_wheel',
        createdAt: '2024-12-18T12:50:09.388Z',
        ocean: 'Blue',
        name: 'Velperplein',
      },
      createdAt: '2024-12-18T12:50:09.388Z',
      type: 'toilet',
      dates: ['Wed Dec 18 2024', 'Thu Dec 19 2024'],
    },
  })
  @Get('byId/:id')
  findOne(@Param('id') id: string) {
    return this.utilitiesService.findOne(id);
  }

  @ApiOkResponse({
    description: 'This action returns utilities by type and/or date',
    example: [
      {
        id: '244996f6-95af-4f80-bf91-389bbca80814',
        name: 'Toilet Velperplein',
        description:
          'This is the toilet at Velperplein which is open from 08:00 till 22:00.',
        location: {
          id: '3d39c9f6-9b75-42db-b167-6e1b002b6503',
          location: {
            longitude: 51.985103,
            latitude: 5.89873,
          },
          icon: 'cheese_wheel',
          createdAt: '2024-12-18T12:50:25.846Z',
          ocean: 'Blue',
          name: 'Velperplein',
        },
        createdAt: '2024-12-18T12:50:25.846Z',
        type: 'toilet',
        dates: ['Wed Dec 18 2024', 'Thu Dec 19 2024'],
      },
      {
        id: 'f1e92023-9924-4f5b-894b-4e9dbe1fa5e4',
        name: 'Toilet Velperplein',
        description:
          'This is the toilet at Velperplein which is open from 08:00 till 22:00.',
        location: {
          id: 'bb2eecf7-f173-4840-a2e5-8881d0f4604e',
          location: {
            longitude: 51.985103,
            latitude: 5.89873,
          },
          icon: 'cheese_wheel',
          createdAt: '2024-12-18T12:50:25.847Z',
          ocean: 'Blue',
          name: 'Velperplein',
        },
        createdAt: '2024-12-18T12:50:25.847Z',
        type: 'toilet',
        dates: ['Wed Dec 18 2024', 'Thu Dec 19 2024'],
      },
    ],
  })
  @ApiQuery({
    name: 'Date',
    type: Array,
    required: false,
    default: ['2024-10-1'],
    description: 'The date you want to find utilities for',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    required: false,
    default: 'Toilet',
    description: 'The type of utility you want to find',
  })
  @Get('findByTypeAndOrDate')
  findByTypeAndOrDate(
    @Query(
      'Date',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    date?: string[],
    @Query('type') type?: string,
  ) {
    return this.utilitiesService.findByTypeAndOrDate(type, date);
  }

  @ApiOkResponse({
    description: 'This action updates a utility',
    example: {
      id: 'adf31-134',
      name: 'Toilet Velperplein',
      description:
        'This is the toilet at Velperplein which is open from 08:00 till 22:00.',
      location: {
        id: '1',
        location: {
          longitude: 51.985103,
          latitude: 5.89873,
        },
        icon: 'cheese_wheel',
        createdAt: '2024-12-18T12:50:45.281Z',
        ocean: 'Blue',
        name: 'Velperplein',
      },
      type: 'toilet',
      dates: ['2021-09-15', '2021-09-16'],
      createdAt: '2024-12-18T12:50:45.281Z',
    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUtilityDto: UpdateUtilityDto) {
    return this.utilitiesService.update(id, updateUtilityDto);
  }

  @ApiOkResponse({ description: 'This action removes a utility' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utilitiesService.remove(id);
  }

  @ApiOkResponse({ description: 'This action creates mock data' })
  @Post('mock')
  createMockData() {
    return this.utilitiesService.mockData();
  }
}
