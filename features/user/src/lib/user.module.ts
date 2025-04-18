import { Token, User } from '@/entities';
import { JwtAuthGuard, RolesGuard } from '@/guards';
import { EncryptionService, OtpService } from '@/helpers';
import { MailModule } from '@/mail';
import { SmsModule } from '@/sms';
import { TokenModule } from '@/token';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token]), SmsModule, MailModule, TokenModule],
  controllers: [UserController],
  providers: [UserService, EncryptionService, OtpService, JwtAuthGuard, RolesGuard, JwtService],
  exports: [UserService],
})
export class UserModule {}
