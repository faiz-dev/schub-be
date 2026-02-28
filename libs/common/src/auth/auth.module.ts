import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'dev_jwt_secret'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '15m') as any,
        },
      }),
    }),
  ],
  providers: [JwtStrategy, RolesGuard],
  exports: [JwtModule, PassportModule, JwtStrategy, RolesGuard],
})
export class CommonAuthModule { }
