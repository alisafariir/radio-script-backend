import { Otp } from '@/entities';
import { EncryptionService } from '@/helpers';
import { MailService } from '@/mail';
import { SmsService } from '@/sms';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  controllers: [OtpController],
  providers: [OtpService, EncryptionService, MailService, SmsService, I18nModule],
  exports: [OtpService],
})
export class OtpModule {}
