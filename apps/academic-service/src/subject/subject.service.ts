import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject, CreateSubjectDto, UpdateSubjectDto, ErrorLabels } from '@app/common';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) { }

  async create(dto: CreateSubjectDto) {
    const subject = this.subjectRepository.create(dto);
    const saved = await this.subjectRepository.save(subject);
    return { message: 'Subject created', data: saved };
  }

  async findAll() {
    const subjects = await this.subjectRepository.find({ order: { name: 'ASC' } });
    return { message: 'Subjects retrieved', data: subjects };
  }

  async findOne(id: string) {
    const subject = await this.subjectRepository.findOne({ where: { id } });
    if (!subject) {
      throw new NotFoundException({ message: 'Subject not found', error: ErrorLabels.DATA_NOT_FOUND });
    }
    return { message: 'Subject retrieved', data: subject };
  }

  async update(id: string, dto: UpdateSubjectDto) {
    const subject = await this.subjectRepository.findOne({ where: { id } });
    if (!subject) {
      throw new NotFoundException({ message: 'Subject not found', error: ErrorLabels.DATA_NOT_FOUND });
    }
    Object.assign(subject, dto);
    const saved = await this.subjectRepository.save(subject);
    return { message: 'Subject updated', data: saved };
  }

  async remove(id: string) {
    const subject = await this.subjectRepository.findOne({ where: { id } });
    if (!subject) {
      throw new NotFoundException({ message: 'Subject not found', error: ErrorLabels.DATA_NOT_FOUND });
    }
    await this.subjectRepository.remove(subject);
    return { message: 'Subject deleted' };
  }
}
