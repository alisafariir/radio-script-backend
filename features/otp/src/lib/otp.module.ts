import { Otp } from '@/entities';
import { EncryptionService } from '@/helpers';
import { MailService } from '@/mail';
import { SmsService } from '@/sms';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  controllers: [OtpController],
  providers: [OtpService, EncryptionService, MailService, SmsService],
  exports: [OtpService],
})
export class OtpModule {}
