import { CreateOtpDto } from '@/dtos';
import { Otp } from '@/entities';
import { detectInputType, EncryptionService } from '@/helpers';
import { MailService } from '@/mail';
import { SmsService } from '@/sms';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private encryptionService: EncryptionService,
    private smsService: SmsService,
    private mailService: MailService
  ) {}

  async sendOtp(recipient?: string) {
    if (!recipient) {
      throw new BadRequestException('دریافت کننده الزامی است.');
    }
    try {
      const otp = await this.generateOTP();
      const eOtp = await this.encryptionService.hash(otp);
      const otp_expiration = await this.generateExpireTime();
      let type = 'invalid';
      switch (detectInputType(recipient)) {
        case 'email':
          type = 'email';
          break;
        case 'phone':
          type = 'sms';
          break;
        case 'invalid':
          type = 'invalid';
          throw new BadRequestException('مقدار دریافت کننده صحیح نیست.');
      }

      await this.smsService.sendOtp(recipient, otp);
      await this.createOtp({ otp: eOtp, recipient, otp_expiration, type });
      return { message: 'رمز یکبار مصرف ارسال شد.' };
    } catch (error) {
      throw new BadRequestException('خطا در ارسال رمز یکبار‌مصرف', error);
    }
  }

  protected async createOtp({ recipient, otp, otp_expiration, type }: CreateOtpDto) {
    try {
      const existingOtp = await this.otpRepository.findOne({
        where: [{ recipient }],
      });

      if (existingOtp) {
        await this.otpRepository.update(existingOtp.id, {
          recipient,
          otp,
          otp_expiration,
          type,
        });
      } else {
        const otpRecord = this.otpRepository.create({
          recipient,
          otp,
          otp_expiration,
          type,
        });
        await this.otpRepository.save(otpRecord);
      }
    } catch (error) {
      throw new BadRequestException('خطا در ارسال رمز یکبار‌مصرف', error);
    }
  }

  async verifyOtp(otp: string, recipient?: string) {
    const foundedOtp = await this.otpRepository.findOne({
      where: [{ recipient }],
    });

    if (!foundedOtp) {
      throw new BadRequestException('کد یکبار مصرف صحیح نیست');
    }

    const isValidOtp = await this.encryptionService.compare(otp, foundedOtp.otp);
    if (!isValidOtp) throw new BadRequestException('کد یکبار مصرف صحیح نیست');

    const currentTime = new Date().getTime();
    const otp_expiration = new Date(foundedOtp.otp_expiration).getTime();

    if (currentTime >= otp_expiration) {
      throw new HttpException('کد یکبار مصرف منقضی شده است', 410);
    }

    await this.otpRepository.delete(foundedOtp.id);
  }

  protected async generateOTP() {
    return await Math.floor(1000 + Math.random() * 9000).toString();
  }

  protected async generateExpireTime() {
    const now = new Date();
    return new Date(now.getTime() + 2 * 60 * 1000).toISOString();
  }
}
