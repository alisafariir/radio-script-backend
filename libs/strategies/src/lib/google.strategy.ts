import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID', ''),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET', ''),
      callbackURL: configService.getOrThrow<string>('GOOGLE_AUTH_CALLBACK_URL', ''),
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
