import { Controller, Get, Post, Delete, Body, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TeachingAssignmentService } from './teaching-assignment.service';
import { CreateTeachingAssignmentDto, JwtAuthGuard, RolesGuard, Roles, UserRole } from '@app/common';

@ApiTags('Teaching Assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teaching-assignments')
export class TeachingAssignmentController {
  constructor(private readonly assignmentService: TeachingAssignmentService) { }

  @Post()
  @Roles(UserRole.OPERATOR)
  async create(@Body() dto: CreateTeachingAssignmentDto) {
    return this.assignmentService.create(dto);
  }

  @Get()
  async findAll(
    @Query('academicYearId') academicYearId?: string,
    @Query('teacherId') teacherId?: string,
  ) {
    return this.assignmentService.findAll(academicYearId, teacherId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentService.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRole.OPERATOR)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentService.remove(id);
  }
}
