import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  User,
  Profile,
  AcademicYear,
  Department,
  SchoolClass,
  Enrollment,
  Subject,
  TeachingAssignment,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'schoolhub'),
        entities: [
          User,
          Profile,
          AcademicYear,
          Department,
          SchoolClass,
          Enrollment,
          Subject,
          TeachingAssignment,
        ],
        autoLoadEntities: false,
        synchronize: configService.get<string>('DATABASE_SYNC', 'false') === 'true',
      }),
    }),
  ],
})
export class DatabaseModule { }
