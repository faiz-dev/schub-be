import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchoolClass, CreateClassDto, UpdateClassDto, ErrorLabels } from '@app/common';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(SchoolClass)
    private readonly classRepository: Repository<SchoolClass>,
  ) { }

  async create(dto: CreateClassDto) {
    const schoolClass = this.classRepository.create(dto);
    const saved = await this.classRepository.save(schoolClass);
    return { message: 'Class created', data: saved };
  }

  async findAll() {
    const classes = await this.classRepository.find({
      relations: ['department'],
      order: { name: 'ASC' },
    });
    return { message: 'Classes retrieved', data: classes };
  }

  async findByDepartment(departmentId: string) {
    const classes = await this.classRepository.find({
      where: { departmentId },
      relations: ['department'],
      order: { name: 'ASC' },
    });
    return { message: 'Classes retrieved', data: classes };
  }

  async findOne(id: string) {
    const schoolClass = await this.classRepository.findOne({
      where: { id },
      relations: ['department'],
    });
    if (!schoolClass) {
      throw new NotFoundException({ message: 'Class not found', error: ErrorLabels.DATA_NOT_FOUND });
    }
    return { message: 'Class retrieved', data: schoolClass };
  }

  async update(id: string, dto: UpdateClassDto) {
    const schoolClass = await this.classRepository.findOne({ where: { id } });
    if (!schoolClass) {
      throw new NotFoundException({ message: 'Class not found', error: ErrorLabels.DATA_NOT_FOUND });
    }
    Object.assign(schoolClass, dto);
    const saved = await this.classRepository.save(schoolClass);
    return { message: 'Class updated', data: saved };
  }

  async remove(id: string) {
    const schoolClass = await this.classRepository.findOne({ where: { id } });
    if (!schoolClass) {
      throw new NotFoundException({ message: 'Class not found', error: ErrorLabels.DATA_NOT_FOUND });
    }
    await this.classRepository.remove(schoolClass);
    return { message: 'Class deleted' };
  }
}
