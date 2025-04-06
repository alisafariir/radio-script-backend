import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    if (!configService.get<string>('GH_CLIENT_ID')) {
      throw new Error('GH_CLIENT_ID is not defined in the environment');
    }
    if (!configService.get<string>('GH_CLIENT_SECRET')) {
      throw new Error('GH_CLIENT_SECRET is not defined in the environment');
    }
    if (!configService.get<string>('GH_AUTH_CALLBACK_URL')) {
      throw new Error('GH_AUTH_CALLBACK_URL is not defined in the environment');
    }
    super({
      clientID: configService.get<string>('GH_CLIENT_ID', ''), // Provide a default value
      clientSecret: configService.get<string>('GH_CLIENT_SECRET', ''), // Provide a default value
      callbackURL: configService.get<string>('GH_AUTH_CALLBACK_URL', ''), // Provide a default value
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
