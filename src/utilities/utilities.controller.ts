import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import {ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse} from "@nestjs/swagger";

@Controller('utilities')
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}

  @ApiCreatedResponse({description: 'This action adds a new utility'})
  @Post()
  create(@Body() createUtilityDto: CreateUtilityDto) {
    return this.utilitiesService.create(createUtilityDto);
  }

  @ApiOkResponse({description: 'This action returns all utilities'})
  @Get()
  findAll() {
    return this.utilitiesService.findAll();
  }

  @ApiOkResponse({description: 'This action returns a utility'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.utilitiesService.findOne(+id);
  }

  @ApiOkResponse({description: 'This action updates a utility'})
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
