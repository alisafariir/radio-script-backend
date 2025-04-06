import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  smsEndpoint: string;
  smsToken: string;
  smsBodyId: string;
  constructor(private configService: ConfigService, private httpService: HttpService) {
    this.smsEndpoint = this.configService.get<string>('SMS_SERVICE_ENDPOINT');
    this.smsToken = this.configService.get<string>('SMS_SERVICE_TOKEN');
    this.smsBodyId = this.configService.get<string>('SMS_SERVICE_BODY_ID');

    if (!this.smsEndpoint) {
      throw new InternalServerErrorException('SMS_SERVICE_ENDPOINT not found in environment variables');
    }

    if (!this.smsToken) {
      throw new InternalServerErrorException('SMS_SERVICE_TOKEN not found in environment variables');
    }

    if (!this.smsBodyId) {
      throw new InternalServerErrorException('SMS_SERVICE_BODY_ID not found in environment variables');
    }
  }

  async sendOtp(phone_number: string, otp: string) {
    return await this.sendMessage(phone_number, [otp]);
  }

  async sendMessage(phone_number: string, args: unknown[]) {
    const body = { to: phone_number, bodyId: this.smsBodyId, args };
    const res = await this.httpService.axiosRef.post(`${this.smsEndpoint}/${this.smsToken}`, body);
    return res.data;
  }
}
