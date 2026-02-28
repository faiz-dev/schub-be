import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {
  DatabaseModule,
  Department,
  SchoolClass,
  Subject,
  AcademicYear
} from '@app/common';
import { AcademicSeeder } from '../seeder';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      Department,
      SchoolClass,
      Subject,
      AcademicYear
    ]),
  ],
  providers: [AcademicSeeder],
})
export class SeederModule { }
