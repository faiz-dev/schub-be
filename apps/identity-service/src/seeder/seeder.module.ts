import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, User, Profile } from '@app/common';
import { UsersSeeder } from '../seeder';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TypeOrmModule.forFeature([User, Profile]),
  ],
  providers: [UsersSeeder],
})
export class SeederModule { }
