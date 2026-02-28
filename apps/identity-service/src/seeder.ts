import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { User, Profile, UserRole } from '@app/common';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) { }

  async seed(): Promise<any> {
    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Create Admin Operator
    const operatorCount = await this.userRepository.count({ where: { role: UserRole.OPERATOR } });
    console.log(`Operator count: ${operatorCount}`);
    if (operatorCount === 0) {
      const admin = this.userRepository.create({
        email: 'admin@schoolhub.com',
        passwordHash,
        role: UserRole.OPERATOR,
        isActive: true,
      });
      const savedAdmin = await this.userRepository.save(admin);

      const adminProfile = this.profileRepository.create({
        userId: savedAdmin.id,
        fullName: 'Super Administrator',
        phone: '081234567890',
        address: 'School Hub HQ',
      });
      await this.profileRepository.save(adminProfile);
      console.log('Operator seeded successfully');
    }

    // 2. Create Dummy Students & Teachers
    const count = await this.userRepository.count();

    if (count <= 1) { // Only admin exists
      // Create 5 Teachers
      for (let i = 0; i < 5; i++) {
        const teacher = await this.userRepository.save({
          email: faker.internet.email().toLowerCase(),
          passwordHash,
          role: UserRole.TEACHER,
          isActive: true,
        });

        await this.profileRepository.save({
          userId: teacher.id,
          fullName: faker.person.fullName(),
          nip: faker.string.numeric(18),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
        });
      }

      // Create 20 Students
      for (let i = 0; i < 20; i++) {
        const student = await this.userRepository.save({
          email: faker.internet.email().toLowerCase(),
          passwordHash,
          role: UserRole.STUDENT,
          isActive: true,
        });

        await this.profileRepository.save({
          userId: student.id,
          fullName: faker.person.fullName(),
          nisn: faker.string.numeric(10),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
        });
      }
      console.log('Dummy Teachers and Students seeded successfully');
    } else {
      console.log('Users already seeded, skipping...');
    }
  }

  async drop(): Promise<any> {
    await this.profileRepository.delete({});
    await this.userRepository.delete({});
  }
}
