import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Global()
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token;
        },
      ]),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET_KEY', ''),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refresh_token = req.cookies?.refresh_token;

    return { ...payload, refresh_token };
  }
}
