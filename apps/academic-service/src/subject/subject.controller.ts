import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubjectService } from './subject.service';
import { CreateSubjectDto, UpdateSubjectDto } from '@app/common';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) { }

  @Post()
  async create(@Body() dto: CreateSubjectDto) { return this.subjectService.create(dto); }

  @Get()
  async findAll() { return this.subjectService.findAll(); }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) { return this.subjectService.findOne(id); }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSubjectDto) {
    return this.subjectService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) { return this.subjectService.remove(id); }
}
