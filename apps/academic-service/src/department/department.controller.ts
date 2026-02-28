import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from '@app/common';

@ApiTags('Departments')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post()
  async create(@Body() dto: CreateDepartmentDto) { return this.departmentService.create(dto); }

  @Get()
  async findAll() { return this.departmentService.findAll(); }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) { return this.departmentService.findOne(id); }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDepartmentDto) {
    return this.departmentService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) { return this.departmentService.remove(id); }
}
