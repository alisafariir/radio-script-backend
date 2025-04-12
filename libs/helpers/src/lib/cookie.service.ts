import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';

@Injectable()
export class CookieService {
  maxAge: number;
  expires: Date;

  constructor(private configService: ConfigService) {
    const today = new Date();
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(today.getFullYear() + 1);
    this.maxAge = oneYearLater.getTime();
    this.expires = oneYearLater;
  }

  setCookieOptions(): CookieOptions {
    const env = this.configService.get<string>('NODE_ENV') ?? 'development';
    const isProduction = env === 'production';
    const domain = this.configService.get<string>('APP_DOMAIN_WILDCARD');

    const cookieOptions: CookieOptions = {
      priority: 'high',
      path: '/',
      maxAge: this.maxAge,
      expires: this.expires,
      httpOnly: true,
      sameSite: 'none', // Required for cross-site
      secure: true, // ✅ MUST be true if SameSite is 'none'
    };

    if (isProduction && domain) {
      cookieOptions.domain = domain;
    }

    return cookieOptions;
  }
  async setResponseTokenCookies(res: Response, access_token: string, refresh_token: string) {
    const cookieOptions = this.setCookieOptions();
    res.cookie('access_token', access_token, cookieOptions);
    res.cookie('refresh_token', refresh_token, cookieOptions);
  }
  async deleteResponseTokenCookies(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
