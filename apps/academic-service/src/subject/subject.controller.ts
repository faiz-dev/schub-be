import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SubjectService } from './subject.service';
import { CreateSubjectDto, UpdateSubjectDto, JwtAuthGuard, RolesGuard, Roles, UserRole } from '@app/common';

@ApiTags('Subjects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) { }

  @Post()
  @Roles(UserRole.OPERATOR)
  async create(@Body() dto: CreateSubjectDto) { return this.subjectService.create(dto); }

  @Get()
  async findAll() { return this.subjectService.findAll(); }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) { return this.subjectService.findOne(id); }

  @Put(':id')
  @Roles(UserRole.OPERATOR)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSubjectDto) {
    return this.subjectService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.OPERATOR)
  async remove(@Param('id', ParseUUIDPipe) id: string) { return this.subjectService.remove(id); }
}
