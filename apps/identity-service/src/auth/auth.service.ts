import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import {
  User,
  Profile,
  CreateUserDto,
  LoginDto,
  ErrorLabels,
  UserRole,
} from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async register(dto: CreateUserDto) {
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

    const tokens = await this.generateTokens(savedUser);
    return {
      message: 'Registration successful',
      data: { user: this.sanitizeUser(savedUser), ...tokens },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException({
        message: 'Invalid email or password',
        error: ErrorLabels.AUTH_INVALID_CREDENTIALS,
      });
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Invalid email or password',
        error: ErrorLabels.AUTH_INVALID_CREDENTIALS,
      });
    }

    const tokens = await this.generateTokens(user);
    return {
      message: 'Login successful',
      data: { user: this.sanitizeUser(user), ...tokens },
    };
  }

  async handleGoogleLogin(googleUser: {
    googleId: string;
    email: string;
    fullName: string;
    photoUrl?: string;
  }) {
    let user = await this.userRepository.findOne({
      where: { googleId: googleUser.googleId },
    });

    if (!user) {
      // Check if email already exists (link accounts)
      user = await this.userRepository.findOne({
        where: { email: googleUser.email },
      });

      if (user) {
        user.googleId = googleUser.googleId;
        user = await this.userRepository.save(user);
      } else {
        // Create new user
        user = this.userRepository.create({
          email: googleUser.email,
          googleId: googleUser.googleId,
          role: UserRole.STUDENT,
        });
        user = await this.userRepository.save(user);

        const profile = this.profileRepository.create({
          userId: user.id,
          fullName: googleUser.fullName,
          photoUrl: googleUser.photoUrl,
        });
        await this.profileRepository.save(profile);
      }
    }

    const tokens = await this.generateTokens(user);
    return {
      message: 'Google login successful',
      data: { user: this.sanitizeUser(user), ...tokens },
    };
  }

  async refreshToken(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        error: ErrorLabels.AUTH_TOKEN_INVALID,
      });
    }

    const tokens = await this.generateTokens(user);
    return {
      message: 'Token refreshed',
      data: tokens,
    };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d') as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }
}
