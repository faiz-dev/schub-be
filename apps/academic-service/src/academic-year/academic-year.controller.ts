import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AcademicYearService } from './academic-year.service';
import { CreateAcademicYearDto, UpdateAcademicYearDto, JwtAuthGuard, RolesGuard, Roles, UserRole } from '@app/common';

@ApiTags('Academic Years')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic-years')
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) { }

  @Post()
  @Roles(UserRole.OPERATOR)
  async create(@Body() dto: CreateAcademicYearDto) {
    return this.academicYearService.create(dto);
  }

  @Get()
  async findAll() {
    return this.academicYearService.findAll();
  }

  @Get('active')
  async findActive() {
    return this.academicYearService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.academicYearService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.OPERATOR)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAcademicYearDto,
  ) {
    return this.academicYearService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.OPERATOR)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.academicYearService.remove(id);
  }
}
