import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService, private readonly configService: ConfigService, private i18nService: I18nService) {}

  async sendOtp(to: string, otp: string): Promise<void> {
    const mailOptions = {
      from: this.configService.getOrThrow<string>('GMAIL_USER'),
      to,
      subject: `${this.configService.getOrThrow<string>('APP_NAME')} / ${this.i18nService.t('mail.OTP')}`,
      text: `${this.i18nService.t('mail.OTP')} ${otp}`,
      template: 'otp',
      context: {
        otp,
      },
    };

    try {
      return await this.mailerService.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }
}
