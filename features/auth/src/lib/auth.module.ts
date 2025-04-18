import { User } from '@/entities';
import { JwtAuthGuard, RolesGuard } from '@/guards';
import { CookieService, EncryptionService, S3Service } from '@/helpers';
import { DeviceInterceptor } from '@/interceptors';
import { OtpModule } from '@/otp';
import { SmsModule } from '@/sms';
import { GithubStrategy, GoogleStrategy, JwtStrategy, RefreshTokenStrategy } from '@/strategies';
import { TokenModule } from '@/token';
import { UserModule } from '@/user';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, PassportModule, SmsModule, TokenModule, OtpModule, TypeOrmModule.forFeature([User])],

  controllers: [AuthController],
  providers: [AuthService, EncryptionService, DeviceInterceptor, JwtService, RolesGuard, JwtAuthGuard, S3Service, CookieService, JwtStrategy, RefreshTokenStrategy, GoogleStrategy, GithubStrategy],
  exports: [AuthService],
})
export class AuthModule {}
