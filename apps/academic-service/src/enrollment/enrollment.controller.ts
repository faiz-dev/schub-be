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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto, UpdateEnrollmentStatusDto, BulkPromoteDto, JwtAuthGuard, RolesGuard, Roles, UserRole } from '@app/common';

@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) { }

  @Post()
  @Roles(UserRole.OPERATOR)
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
  @Roles(UserRole.OPERATOR)
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEnrollmentStatusDto,
  ) {
    return this.enrollmentService.updateStatus(id, dto);
  }

  @Post('promote')
  @Roles(UserRole.OPERATOR)
  async bulkPromote(@Body() dto: BulkPromoteDto) {
    return this.enrollmentService.bulkPromote(dto);
  }

  @Delete(':id')
  @Roles(UserRole.OPERATOR)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollmentService.remove(id);
  }
}
