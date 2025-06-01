// src/auth/auth.module.ts
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersModule } from '../users/users.module';
import { JwtOptionalGuard } from './jwt-optional.guard';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: cfg.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtAuthGuard, JwtOptionalGuard, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard, JwtModule, JwtOptionalGuard],
})
export class AuthModule {}
