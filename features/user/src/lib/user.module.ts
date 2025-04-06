import { User } from '@/entities';
import { EncryptionService, OtpService } from '@/helpers';
import { MailModule } from '@/mail';
import { SmsModule } from '@/sms';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SmsModule, MailModule],
  controllers: [UserController],
  providers: [UserService, EncryptionService, OtpService, JwtService],
  exports: [UserService],
})
export class UserModule {}
