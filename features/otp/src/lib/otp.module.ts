import { Otp } from '@/entities';
import { EncryptionService } from '@/helpers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  controllers: [OtpController],
  providers: [OtpService, EncryptionService],
  exports: [OtpService],
})
export class OtpModule {}
