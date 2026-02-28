import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department, CreateDepartmentDto, UpdateDepartmentDto, ErrorLabels } from '@app/common';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) { }

  async create(dto: CreateDepartmentDto) {
    const department = this.departmentRepository.create(dto);
    const saved = await this.departmentRepository.save(department);
    return { message: 'Department created', data: saved };
  }

  async findAll() {
    const departments = await this.departmentRepository.find({
      relations: ['classes'],
      order: { name: 'ASC' },
    });
    return { message: 'Departments retrieved', data: departments };
  }

  async findOne(id: string) {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['classes'],
    });
    if (!department) {
      throw new NotFoundException({ message: 'Department not found', error: ErrorLabels.DATA_NOT_FOUND });
    }
    return { message: 'Department retrieved', data: department };
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    const department = await this.departmentRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException({ message: 'Department not found', error: ErrorLabels.DATA_NOT_FOUND });
    }
    Object.assign(department, dto);
    const saved = await this.departmentRepository.save(department);
    return { message: 'Department updated', data: saved };
  }

  async remove(id: string) {
    const department = await this.departmentRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException({ message: 'Department not found', error: ErrorLabels.DATA_NOT_FOUND });
    }
    await this.departmentRepository.remove(department);
    return { message: 'Department deleted' };
  }
}
