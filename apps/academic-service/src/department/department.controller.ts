import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto, JwtAuthGuard, RolesGuard, Roles, UserRole } from '@app/common';

@ApiTags('Departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post()
  @Roles(UserRole.OPERATOR)
  async create(@Body() dto: CreateDepartmentDto) { return this.departmentService.create(dto); }

  @Get()
  async findAll() { return this.departmentService.findAll(); }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) { return this.departmentService.findOne(id); }

  @Put(':id')
  @Roles(UserRole.OPERATOR)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDepartmentDto) {
    return this.departmentService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.OPERATOR)
  async remove(@Param('id', ParseUUIDPipe) id: string) { return this.departmentService.remove(id); }
}
