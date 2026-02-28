import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import {
  AcademicYear,
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
  ErrorLabels,
} from '@app/common';

@Injectable()
export class AcademicYearService {
  constructor(
    @InjectRepository(AcademicYear)
    private readonly academicYearRepository: Repository<AcademicYear>,
  ) { }

  async create(dto: CreateAcademicYearDto) {
    // If setting as active, deactivate others first
    if (dto.isActive) {
      await this.academicYearRepository.update({}, { isActive: false });
    }

    const academicYear = this.academicYearRepository.create(dto);
    const saved = await this.academicYearRepository.save(academicYear);
    return { message: 'Academic year created', data: saved };
  }

  async findAll() {
    const years = await this.academicYearRepository.find({
      order: { startDate: 'DESC' },
    });
    return { message: 'Academic years retrieved', data: years };
  }

  async findOne(id: string) {
    const year = await this.academicYearRepository.findOne({ where: { id } });
    if (!year) {
      throw new NotFoundException({
        message: 'Academic year not found',
        error: ErrorLabels.DATA_NOT_FOUND,
      });
    }
    return { message: 'Academic year retrieved', data: year };
  }

  async findActive() {
    const year = await this.academicYearRepository.findOne({
      where: { isActive: true },
    });
    if (!year) {
      throw new NotFoundException({
        message: 'No active academic year found',
        error: ErrorLabels.DATA_NOT_FOUND,
      });
    }
    return { message: 'Active academic year retrieved', data: year };
  }

  async update(id: string, dto: UpdateAcademicYearDto) {
    const year = await this.academicYearRepository.findOne({ where: { id } });
    if (!year) {
      throw new NotFoundException({
        message: 'Academic year not found',
        error: ErrorLabels.DATA_NOT_FOUND,
      });
    }

    // If setting as active, deactivate others first
    if (dto.isActive) {
      await this.academicYearRepository.update(
        { id: Not(id) },
        { isActive: false },
      );
    }

    Object.assign(year, dto);
    const saved = await this.academicYearRepository.save(year);
    return { message: 'Academic year updated', data: saved };
  }

  async remove(id: string) {
    const year = await this.academicYearRepository.findOne({ where: { id } });
    if (!year) {
      throw new NotFoundException({
        message: 'Academic year not found',
        error: ErrorLabels.DATA_NOT_FOUND,
      });
    }
    await this.academicYearRepository.remove(year);
    return { message: 'Academic year deleted' };
  }
}
