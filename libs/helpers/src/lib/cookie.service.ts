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

  setCookieOptions() {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const domain = this.configService.get<string>('APP_DOMAIN_WILDCARD');
    if (!domain) {
      throw new Error('APP_DOMAIN_WILDCARD is not defined in the environment');
    }
    const cookieOptions: CookieOptions = {
      priority: 'high',
      secure: false,
      path: '/',
      domain,
      maxAge: this.maxAge,
      expires: this.expires,
    };
    if (isProduction) {
      cookieOptions.secure = true;
      cookieOptions.httpOnly = true;
      cookieOptions.sameSite = 'none';
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
