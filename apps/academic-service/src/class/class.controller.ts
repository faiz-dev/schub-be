import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClassService } from './class.service';
import { CreateClassDto, UpdateClassDto } from '@app/common';

@ApiTags('Classes')
@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) { }

  @Post()
  async create(@Body() dto: CreateClassDto) { return this.classService.create(dto); }

  @Get()
  async findAll(@Query('departmentId') departmentId?: string) {
    if (departmentId) return this.classService.findByDepartment(departmentId);
    return this.classService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) { return this.classService.findOne(id); }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateClassDto) {
    return this.classService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) { return this.classService.remove(id); }
}
