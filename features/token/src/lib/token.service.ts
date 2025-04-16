import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';

import { I18nService } from 'nestjs-i18n';
import { DeleteResult, Repository } from 'typeorm';

import { Token, User } from '@/entities';
import { DeviceInfo } from '@/interfaces';

import moment = require('moment');

@Injectable()
export class TokenService {
  private readonly jwtSecretKey: string;

  constructor(
    @InjectRepository(Token) private readonly tokenRepo: Repository<Token>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService
  ) {
    this.jwtSecretKey = this.configService.getOrThrow<string>('JWT_SECRET_KEY');
  }

  async createToken(user: User, accessToken: string, refreshToken: string, accessTokenExp: Date, refreshTokenExp: Date, deviceInfo: DeviceInfo): Promise<Token> {
    const token = this.tokenRepo.create({
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expiration: accessTokenExp,
      refresh_token_expiration: refreshTokenExp,
      user,
      user_id: user.id,
      ...deviceInfo,
    });
    return this.tokenRepo.save(token);
  }

  async generateTokens(user: User, deviceInfo: DeviceInfo) {
    const payload = { sub: user.id };
    const accessTokenExp = moment().add(1, 'hours').toDate();
    const refreshTokenExp = moment().add(7, 'days').toDate();

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: this.jwtSecretKey,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.jwtSecretKey,
    });

    await this.createToken(user, accessToken, refreshToken, accessTokenExp, refreshTokenExp, deviceInfo);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshToken(refreshToken: string, deviceInfo: DeviceInfo) {
    if (!refreshToken) {
      throw new UnauthorizedException(this.i18n.t('error.REFRESH_TOKEN_REQUIRED'));
    }

    const tokenRecord = await this.findTokenByRefreshToken(refreshToken);
    if (!tokenRecord) {
      throw new UnauthorizedException(this.i18n.t('error.REFRESH_TOKEN_NOT_FOUND'));
    }

    try {
      await this.verifyToken(refreshToken);
      const user = await this.userRepo.findOne({ where: { id: tokenRecord.user_id } });
      if (!user) throw new UnauthorizedException(this.i18n.t('error.USER_REFRESH_TOKEN_NOT_FOUND'));

      await this.deleteByRefreshToken(refreshToken);
      return this.generateTokens(user, deviceInfo);
    } catch {
      await this.deleteByRefreshToken(refreshToken);
      throw new UnauthorizedException(this.i18n.t('error.REFRESH_TOKEN_EXPIRED'));
    }
  }

  async validateToken(request: Request): Promise<boolean> {
    const token = this.extractTokenFromHeader(request);
    try {
      const payload = await this.verifyToken(token);
      const tokenRecord = await this.tokenRepo.findOne({
        where: { access_token: token, user: { id: payload.sub } },
      });

      if (!tokenRecord || tokenRecord.access_token_expiration < new Date()) {
        throw new UnauthorizedException(this.i18n.t('error.ACCESS_TOKEN_EXPIRED'));
      }

      tokenRecord.last_accessed = new Date();
      await this.tokenRepo.save(tokenRecord);
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException(this.i18n.t('error.ACCESS_TOKEN_EXPIRED'));
    }
  }

  async revokeTokenByRequest(req: Request): Promise<DeleteResult> {
    const token = this.extractTokenFromHeader(req);
    const record = await this.tokenRepo.findOne({ where: { access_token: token } });
    return this.tokenRepo.delete(record?.id);
  }

  async revokeToken(token: string): Promise<void> {
    const record = await this.tokenRepo.findOne({ where: { access_token: token } });
    if (record) await this.tokenRepo.delete(record.id);
  }

  async revokeTokensByDevice(userId: string, deviceType: string): Promise<void> {
    await this.tokenRepo.delete({ user: { id: userId }, device_type: deviceType });
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    const record = await this.findTokenByRefreshToken(refreshToken);
    if (record) await this.tokenRepo.delete(record.id);
  }

  async deleteAllTokensByUserId(userId: string): Promise<void> {
    await this.tokenRepo.delete({ user_id: userId });
  }

  async deleteExpiredTokens(): Promise<number> {
    const now = new Date();
    const result = await this.tokenRepo.createQueryBuilder().delete().from(Token).where('access_token_expiration < :now AND refresh_token_expiration < :now', { now }).execute();

    return result.affected || 0;
  }

  async getActiveDevices(userId: string): Promise<Token[]> {
    return this.tokenRepo.find({
      where: { user: { id: userId } },
      select: ['device_type', 'os', 'browser', 'ip_address', 'last_accessed'],
    });
  }

  async findTokenByUser(userId: string): Promise<Token | null> {
    return this.tokenRepo.findOne({ where: { user: { id: userId } } });
  }

  async findTokenByRefreshToken(refreshToken: string): Promise<Token | null> {
    return this.tokenRepo.findOne({ where: { refresh_token: refreshToken } });
  }

  async decodeJwt(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }

  private extractTokenFromHeader(req: Request): string {
    const [type, token] = req.headers['authorization']?.split(' ') ?? [];
    if (!token || type !== 'Bearer') {
      throw new UnauthorizedException(this.i18n.t('error.REFRESH_TOKEN_NOT_FOUND'));
    }
    return token;
  }

  private async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, { secret: this.jwtSecretKey });
  }
}
