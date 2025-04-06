// apps/api/src/app/auth/jwt.strategy.ts
import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Global()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    if (!configService.get<string>('JWT_SECRET_KEY')) {
      throw new Error('JWT_SECRET_KEY is not defined in the environment');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY') || '',
      passReqToCallback: true,
    });
  }

  async validate(payload: any) {
    return { user_id: payload.sub };
  }
}
