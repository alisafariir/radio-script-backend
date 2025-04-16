import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GH_CLIENT_ID', ''), // Provide a default value
      clientSecret: configService.getOrThrow<string>('GH_CLIENT_SECRET', ''), // Provide a default value
      callbackURL: configService.getOrThrow<string>('GH_AUTH_CALLBACK_URL', ''), // Provide a default value
      scope: ['user:email'],
    });
  }

  async validate(access_token: string, refresh_token: string, profile: any, done: any): Promise<any> {
    const { username, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      username,
      picture: photos[0].value,
      access_token,
    };
    done(null, user);
  }
}
