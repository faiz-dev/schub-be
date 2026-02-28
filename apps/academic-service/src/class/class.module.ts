import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolClass } from '@app/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolClass])],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassModule { }
