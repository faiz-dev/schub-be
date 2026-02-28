import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Profile, CreateUserDto, ErrorLabels, UserRole, PageOptionsDto, paginate } from '@app/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) { }

  async createUser(dto: CreateUserDto) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException({
        message: 'Email already registered',
        error: ErrorLabels.AUTH_EMAIL_ALREADY_EXISTS,
      });
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      email: dto.email,
      passwordHash,
      role: dto.role || UserRole.STUDENT,
    });
    const savedUser = await this.userRepository.save(user);

    const profile = this.profileRepository.create({
      userId: savedUser.id,
      fullName: dto.fullName,
      nisn: dto.nisn,
      nip: dto.nip,
      phone: dto.phone,
      address: dto.address,
    });
    await this.profileRepository.save(profile);

    return {
      message: 'User created',
      data: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        isActive: savedUser.isActive,
      },
    };
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile');

    if (pageOptionsDto.search) {
      const keyword = `%${pageOptionsDto.search}%`;
      queryBuilder.where(
        '(user.email ILIKE :keyword OR profile.fullName ILIKE :keyword OR profile.nisn ILIKE :keyword OR profile.nip ILIKE :keyword)',
        { keyword },
      );
    }

    const paginatedResult = await paginate(queryBuilder, pageOptionsDto);
    return { message: 'Users retrieved', data: paginatedResult };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        error: ErrorLabels.DATA_NOT_FOUND,
      });
    }

    return { message: 'User retrieved', data: user };
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        error: ErrorLabels.DATA_NOT_FOUND,
      });
    }

    return { message: 'User retrieved', data: user };
  }

  async updateProfile(userId: string, updateData: Partial<Profile>) {
    const profile = await this.profileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException({
        message: 'Profile not found',
        error: ErrorLabels.DATA_NOT_FOUND,
      });
    }

    Object.assign(profile, updateData);
    const updated = await this.profileRepository.save(profile);
    return { message: 'Profile updated', data: updated };
  }

  async deactivateUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        error: ErrorLabels.DATA_NOT_FOUND,
      });
    }

    user.isActive = false;
    const updated = await this.userRepository.save(user);
    return { message: 'User deactivated', data: { id: updated.id, isActive: updated.isActive } };
  }
}
