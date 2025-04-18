import { User } from '@/entities';
import { JwtAuthGuard, RolesGuard } from '@/guards';
import { CookieService, EncryptionService, OtpService, S3Service } from '@/helpers';
import { DeviceInterceptor } from '@/interceptors';
import { SmsModule } from '@/sms';
import { GithubStrategy, GoogleStrategy, JwtStrategy, RefreshTokenStrategy } from '@/strategies';
import { TokenModule } from '@/token';
import { UserModule } from '@/user';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, PassportModule, SmsModule, TokenModule, TypeOrmModule.forFeature([User]), I18nModule],

  controllers: [AuthController],
  providers: [
    AuthService,
    EncryptionService,
    OtpService,
    DeviceInterceptor,
    JwtService,
    RolesGuard,
    JwtAuthGuard,
    S3Service,
    CookieService,
    JwtStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    GithubStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
