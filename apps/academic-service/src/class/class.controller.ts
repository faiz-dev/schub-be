import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ClassService } from './class.service';
import { CreateClassDto, UpdateClassDto, JwtAuthGuard, RolesGuard, Roles, UserRole } from '@app/common';

@ApiTags('Classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) { }

  @Post()
  @Roles(UserRole.OPERATOR)
  async create(@Body() dto: CreateClassDto) { return this.classService.create(dto); }

  @Get()
  async findAll(@Query('departmentId') departmentId?: string) {
    if (departmentId) return this.classService.findByDepartment(departmentId);
    return this.classService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) { return this.classService.findOne(id); }

  @Put(':id')
  @Roles(UserRole.OPERATOR)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateClassDto) {
    return this.classService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.OPERATOR)
  async remove(@Param('id', ParseUUIDPipe) id: string) { return this.classService.remove(id); }
}
