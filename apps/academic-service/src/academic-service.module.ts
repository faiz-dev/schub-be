import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common';
import { AcademicYearModule } from './academic-year/academic-year.module';
import { DepartmentModule } from './department/department.module';
import { ClassModule } from './class/class.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { SubjectModule } from './subject/subject.module';
import { TeachingAssignmentModule } from './teaching-assignment/teaching-assignment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AcademicYearModule,
    DepartmentModule,
    ClassModule,
    EnrollmentModule,
    SubjectModule,
    TeachingAssignmentModule,
  ],
})
export class AcademicServiceModule { }
