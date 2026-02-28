import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  Enrollment,
  AcademicYear,
  CreateEnrollmentDto,
  UpdateEnrollmentStatusDto,
  BulkPromoteDto,
  ErrorLabels,
  EnrollmentStatus,
} from '@app/common';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(AcademicYear)
    private readonly academicYearRepository: Repository<AcademicYear>,
  ) { }

  async create(dto: CreateEnrollmentDto) {
    // Check for duplicate enrollment
    const existing = await this.enrollmentRepository.findOne({
      where: {
        studentId: dto.studentId,
        academicYearId: dto.academicYearId,
      },
    });
    if (existing) {
      throw new ConflictException({
        message: 'Student is already enrolled for this academic year',
        error: ErrorLabels.ENROLLMENT_DUPLICATE,
      });
    }

    const enrollment = this.enrollmentRepository.create(dto);
    const saved = await this.enrollmentRepository.save(enrollment);
    return { message: 'Enrollment created', data: saved };
  }

  async findAll(academicYearId?: string, classId?: string) {
    const where: Record<string, string> = {};
    if (academicYearId) where['academicYearId'] = academicYearId;
    if (classId) where['classId'] = classId;

    const enrollments = await this.enrollmentRepository.find({
      where,
      relations: ['student', 'schoolClass', 'schoolClass.department', 'academicYear'],
    });
    return { message: 'Enrollments retrieved', data: enrollments };
  }

  async findCurrentByStudent(studentId: string) {
    const activeYear = await this.academicYearRepository.findOne({
      where: { isActive: true },
    });
    if (!activeYear) {
      throw new NotFoundException({
        message: 'No active academic year found',
        error: ErrorLabels.DATA_NOT_FOUND,
      });
    }

    const enrollment = await this.enrollmentRepository.findOne({
      where: { studentId, academicYearId: activeYear.id },
      relations: ['schoolClass', 'schoolClass.department', 'academicYear'],
    });
    if (!enrollment) {
      throw new NotFoundException({
        message: 'No enrollment found for current academic year',
        error: ErrorLabels.DATA_NOT_FOUND,
      });
    }

    return { message: 'Current enrollment retrieved', data: enrollment };
  }

  async findHistoryByStudent(studentId: string) {
    const enrollments = await this.enrollmentRepository.find({
      where: { studentId },
      relations: ['schoolClass', 'schoolClass.department', 'academicYear'],
      order: { createdAt: 'DESC' },
    });
    return { message: 'Enrollment history retrieved', data: enrollments };
  }

  async updateStatus(id: string, dto: UpdateEnrollmentStatusDto) {
    const enrollment = await this.enrollmentRepository.findOne({ where: { id } });
    if (!enrollment) {
      throw new NotFoundException({
        message: 'Enrollment not found',
        error: ErrorLabels.DATA_NOT_FOUND,
      });
    }

    enrollment.status = dto.status;
    const saved = await this.enrollmentRepository.save(enrollment);
    return { message: 'Enrollment status updated', data: saved };
  }

  async bulkPromote(dto: BulkPromoteDto) {
    // Find all enrollments in source class & academic year
    const whereCondition: Record<string, unknown> = {
      academicYearId: dto.fromAcademicYearId,
      classId: dto.fromClassId,
      status: EnrollmentStatus.ACTIVE,
    };

    if (dto.studentIds && dto.studentIds.length > 0) {
      whereCondition['studentId'] = In(dto.studentIds);
    }

    const sourceEnrollments = await this.enrollmentRepository.find({
      where: whereCondition,
    });

    if (sourceEnrollments.length === 0) {
      throw new NotFoundException({
        message: 'No active enrollments found to promote',
        error: ErrorLabels.DATA_NOT_FOUND,
      });
    }

    // Create new enrollments in target class & academic year
    const newEnrollments = sourceEnrollments.map((enrollment) =>
      this.enrollmentRepository.create({
        studentId: enrollment.studentId,
        classId: dto.toClassId,
        academicYearId: dto.toAcademicYearId,
        status: EnrollmentStatus.ACTIVE,
      }),
    );

    const saved = await this.enrollmentRepository.save(newEnrollments);
    return {
      message: `${saved.length} students promoted successfully`,
      data: { promoted: saved.length },
    };
  }

  async remove(id: string) {
    const enrollment = await this.enrollmentRepository.findOne({ where: { id } });
    if (!enrollment) {
      throw new NotFoundException({
        message: 'Enrollment not found',
        error: ErrorLabels.DATA_NOT_FOUND,
      });
    }
    await this.enrollmentRepository.remove(enrollment);
    return { message: 'Enrollment deleted' };
  }
}
