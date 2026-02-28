import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Department,
  SchoolClass,
  Subject,
  AcademicYear
} from '@app/common';
import { Seeder } from 'nestjs-seeder';

@Injectable()
export class AcademicSeeder implements Seeder {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(SchoolClass)
    private readonly classRepository: Repository<SchoolClass>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(AcademicYear)
    private readonly academicYearRepository: Repository<AcademicYear>,
  ) { }

  async seed(): Promise<any> {
    // 1. Seed Academic Year if not exists
    const ayCount = await this.academicYearRepository.count();
    let currentAcademicYear;

    if (ayCount === 0) {
      currentAcademicYear = await this.academicYearRepository.save({
        name: '2023/2024 Odd Semester',
        startDate: new Date('2023-07-15'),
        endDate: new Date('2023-12-20'),
        isActive: true,
      });
      console.log('Academic Year seeded successfully');
    }

    // 2. Seed Departments
    const deptCount = await this.departmentRepository.count();
    let dScience: Department, dSocial: Department;

    if (deptCount === 0) {
      dScience = await this.departmentRepository.save({
        name: 'Science (MIPA)',
        description: 'Mathematics and Natural Sciences',
      });

      dSocial = await this.departmentRepository.save({
        name: 'Social (IPS)',
        description: 'Social Sciences',
      });
      console.log('Departments seeded successfully');

      // 3. Seed Classes for those departments
      const classesToCreate = [
        { name: 'X-MIPA-1', departmentId: dScience.id },
        { name: 'X-MIPA-2', departmentId: dScience.id },
        { name: 'X-IPS-1', departmentId: dSocial.id },
        { name: 'XI-MIPA-1', departmentId: dScience.id },
        { name: 'XII-IPS-1', departmentId: dSocial.id },
      ];

      await this.classRepository.save(classesToCreate);
      console.log('Classes seeded successfully');
    }

    // 4. Seed Subjects
    const subjCount = await this.subjectRepository.count();
    if (subjCount === 0) {
      const subjectsToCreate = [
        { name: 'Mathematics', code: 'MATH101' },
        { name: 'Physics', code: 'PHYS101' },
        { name: 'Biology', code: 'BIO101' },
        { name: 'History', code: 'HIST101' },
        { name: 'English', code: 'ENG101' },
        { name: 'Computer Science', code: 'CS101' },
      ];

      await this.subjectRepository.save(subjectsToCreate);
      console.log('Subjects seeded successfully');
    }
  }

  async drop(): Promise<any> {
    await this.subjectRepository.delete({});
    await this.classRepository.delete({});
    await this.departmentRepository.delete({});
    await this.academicYearRepository.delete({});
  }
}
