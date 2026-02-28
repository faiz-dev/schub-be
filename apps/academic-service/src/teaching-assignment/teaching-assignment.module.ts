import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachingAssignment } from '@app/common';
import { TeachingAssignmentController } from './teaching-assignment.controller';
import { TeachingAssignmentService } from './teaching-assignment.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeachingAssignment])],
  controllers: [TeachingAssignmentController],
  providers: [TeachingAssignmentService],
  exports: [TeachingAssignmentService],
})
export class TeachingAssignmentModule { }
