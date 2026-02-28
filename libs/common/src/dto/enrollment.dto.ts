import { IsNotEmpty, IsOptional, IsUUID, IsEnum, IsArray } from 'class-validator';
import { EnrollmentStatus } from '../enums/enrollment-status.enum';

export class CreateEnrollmentDto {
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;

  @IsUUID()
  @IsNotEmpty()
  classId!: string;

  @IsUUID()
  @IsNotEmpty()
  academicYearId!: string;

  @IsEnum(EnrollmentStatus)
  @IsOptional()
  status?: EnrollmentStatus;
}

export class UpdateEnrollmentStatusDto {
  @IsEnum(EnrollmentStatus)
  @IsNotEmpty()
  status!: EnrollmentStatus;
}

export class BulkPromoteDto {
  @IsUUID()
  @IsNotEmpty()
  fromAcademicYearId!: string;

  @IsUUID()
  @IsNotEmpty()
  toAcademicYearId!: string;

  @IsUUID()
  @IsNotEmpty()
  fromClassId!: string;

  @IsUUID()
  @IsNotEmpty()
  toClassId!: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  studentIds?: string[];
}
