import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}
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
    res.cookie('access_token', access_token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    res.cookie('refresh_token', refresh_token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
  }
  async deleteResponseTokenCookies(res: Response) {
    const cookieOptions = this.setCookieOptions();

    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
  }
}
