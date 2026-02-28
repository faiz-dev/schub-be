import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto, UpdateEnrollmentStatusDto, BulkPromoteDto } from '@app/common';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) { }

  @Post()
  async create(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentService.create(dto);
  }

  @Get()
  async findAll(
    @Query('academicYearId') academicYearId?: string,
    @Query('classId') classId?: string,
  ) {
    return this.enrollmentService.findAll(academicYearId, classId);
  }

  @Get('current')
  async findCurrent(@Query('studentId', ParseUUIDPipe) studentId: string) {
    return this.enrollmentService.findCurrentByStudent(studentId);
  }

  @Get('history')
  async findHistory(@Query('studentId', ParseUUIDPipe) studentId: string) {
    return this.enrollmentService.findHistoryByStudent(studentId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEnrollmentStatusDto,
  ) {
    return this.enrollmentService.updateStatus(id, dto);
  }

  @Post('promote')
  async bulkPromote(@Body() dto: BulkPromoteDto) {
    return this.enrollmentService.bulkPromote(dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollmentService.remove(id);
  }
}
