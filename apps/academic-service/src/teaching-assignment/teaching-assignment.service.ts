import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeachingAssignment, CreateTeachingAssignmentDto, ErrorLabels } from '@app/common';

@Injectable()
export class TeachingAssignmentService {
  constructor(
    @InjectRepository(TeachingAssignment)
    private readonly assignmentRepository: Repository<TeachingAssignment>,
  ) { }

  async create(dto: CreateTeachingAssignmentDto) {
    const assignment = this.assignmentRepository.create(dto);
    const saved = await this.assignmentRepository.save(assignment);
    return { message: 'Teaching assignment created', data: saved };
  }

  async findAll(academicYearId?: string, teacherId?: string) {
    const where: Record<string, string> = {};
    if (academicYearId) where['academicYearId'] = academicYearId;
    if (teacherId) where['teacherId'] = teacherId;

    const assignments = await this.assignmentRepository.find({
      where,
      relations: ['teacher', 'subject', 'schoolClass', 'schoolClass.department', 'academicYear'],
      order: { createdAt: 'DESC' },
    });
    return { message: 'Teaching assignments retrieved', data: assignments };
  }

  async findOne(id: string) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['teacher', 'subject', 'schoolClass', 'schoolClass.department', 'academicYear'],
    });
    if (!assignment) {
      throw new NotFoundException({ message: 'Teaching assignment not found', error: ErrorLabels.DATA_NOT_FOUND });
    }
    return { message: 'Teaching assignment retrieved', data: assignment };
  }

  async remove(id: string) {
    const assignment = await this.assignmentRepository.findOne({ where: { id } });
    if (!assignment) {
      throw new NotFoundException({ message: 'Teaching assignment not found', error: ErrorLabels.DATA_NOT_FOUND });
    }
    await this.assignmentRepository.remove(assignment);
    return { message: 'Teaching assignment deleted' };
  }
}
