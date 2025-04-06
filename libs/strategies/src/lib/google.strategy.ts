import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    if (!configService.get<string>('GOOGLE_CLIENT_ID')) {
      throw new Error('GOOGLE_CLIENT_ID is not defined in the environment');
    }
    if (!configService.get<string>('GOOGLE_CLIENT_SECRET')) {
      throw new Error('GOOGLE_CLIENT_SECRET is not defined in the environment');
    }
    if (!configService.get<string>('GOOGLE_AUTH_CALLBACK_URL')) {
      throw new Error('GOOGLE_AUTH_CALLBACK_URL is not defined in the environment');
    }
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', ''),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', ''),
      callbackURL: configService.get<string>('GOOGLE_AUTH_CALLBACK_URL', ''),
      scope: ['email', 'profile'],
    });
  }

  async validate(access_token: string, refresh_token: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      first_name: name.givenName,
      last_name: name.familyName,
      picture: photos[0].value,
      access_token,
    };
    done(null, user);
  }
}
