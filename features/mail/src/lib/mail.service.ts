import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService, private readonly configService: ConfigService) {}

  async sendOtp(to: string, otp: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('GMAIL_USER'),
      to,
      subject: this.configService.get<string>('APP_NAME') + ' - رمز یکبار مصرف',
      text: `رمز یکبار مصرف${otp}`,
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
