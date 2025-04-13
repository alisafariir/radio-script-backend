import { Token, User } from '@/entities';
import { DeviceInfo } from '@/interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { DeleteResult, Repository } from 'typeorm';
import moment = require('moment');

@Injectable()
export class TokenService {
  jwtSecretKey: string;

  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private configService: ConfigService,
    private jwtService: JwtService
  ) {
    this.jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY');
  }

  async createToken(user: User, access_token: string, refresh_token: string, access_token_expiration: Date, refresh_token_expiration: Date, deviceInfo: DeviceInfo): Promise<Token> {
    const newToken = this.tokenRepository.create({
      access_token,
      refresh_token,
      access_token_expiration,
      refresh_token_expiration,
      user,
      user_id: user.id,
      ...deviceInfo,
    });
    return this.tokenRepository.save(newToken);
  }

  async decodeJwt(token: string): Promise<any> {
    return await this.jwtService.decode(token);
  }

  async revokeTokenByRequest(request: Request): Promise<DeleteResult> {
    const access_token = this.extractTokenFromHeader(request);
    const token = await this.tokenRepository.findOne({
      where: { access_token },
    });
    return await this.tokenRepository.delete(token.id);
  }

  async revokeToken(access_token: string): Promise<void> {
    const token = await this.tokenRepository.findOne({
      where: { access_token },
    });
    await this.tokenRepository.delete(token.id);
  }

  async deleteAllTokensByUserId(user_id: string): Promise<void> {
    await this.tokenRepository.delete({ user_id });
  }

  async findTokenByUser(user_id: string): Promise<Token> {
    return this.tokenRepository.findOne({
      where: { user: { id: user_id } },
    });
  }

  async findTokenByRefreshToken(refresh_token: string): Promise<Token | null> {
    return this.tokenRepository.findOne({ where: { refresh_token } });
  }

  async revokeTokensByDevice(user_id: string, device_type: string): Promise<void> {
    await this.tokenRepository.delete({ user: { id: user_id }, device_type });
  }

  async getActiveDevices(user_id: string): Promise<Token[]> {
    return this.tokenRepository.find({
      where: { user: { id: user_id } },
      select: ['device_type', 'os', 'browser', 'ip_address', 'last_accessed'],
    });
  }

  async verifyTokenAsync(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.jwtSecretKey,
    });
  }
  async verifyRefreshTokenAsync(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.jwtSecretKey,
    });
  }

  async validateToken(request: Request): Promise<boolean> {
    const token = this.extractTokenFromHeader(request);

    try {
      // بررسی اعتبار توکن
      const payload = await this.verifyTokenAsync(token);
      const tokenEntity = await this.tokenRepository.findOne({
        where: { access_token: token, user: { id: payload.sub } },
      });

      if (!tokenEntity || tokenEntity.access_token_expiration < new Date()) {
        throw new UnauthorizedException('توکن نامعتبر یا منقضی شده است.');
      }

      // به‌روزرسانی زمان آخرین دسترسی
      tokenEntity.last_accessed = new Date();
      await this.tokenRepository.save(tokenEntity);

      // افزودن اطلاعات کاربر به Request
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('توکن منقضی شده است.');
    }
  }

  async generateTokens(user: User, deviceInfo: DeviceInfo) {
    const payload = { sub: user.id };
    const expireInAccessToken = moment().add(1, 'minute').toDate();
    const expireInRefreshToken = moment().add(7, 'days').toDate();
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '1m',
      secret: this.jwtSecretKey,
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.jwtSecretKey,
    });
    await this.createToken(
      user,
      access_token,
      refresh_token,
      expireInAccessToken, // 1h
      expireInRefreshToken, // 7d
      deviceInfo
    );

    return {
      access_token,
      refresh_token,
    };
  }

  async refresh_token(refresh_token: string, deviceInfo: DeviceInfo) {
    if (!refresh_token) {
      throw new UnauthorizedException('توکن معتبر نیست');
    }

    const existingToken = await this.findTokenByRefreshToken(refresh_token);
    if (!existingToken) {
      throw new UnauthorizedException('رفرش توکن یافت نشد.');
    }
    try {
      await this.verifyRefreshTokenAsync(existingToken.refresh_token);
      const user = await this.userRepository.findOne({
        where: { id: existingToken.user_id },
      });

      if (!user) {
        throw new UnauthorizedException('کاربری برای این توکن یافت نشد.');
      }

      await this.deleteByRefreshToken(existingToken.refresh_token);
      return await this.generateTokens(user, deviceInfo);
    } catch {
      await this.deleteByRefreshToken(existingToken.refresh_token);
      throw new UnauthorizedException('رفرش توکن معتبر نیست.');
    }
  }

  async deleteByRefreshToken(refresh_token: string): Promise<void> {
    const findedTokenRecord = await this.findTokenByRefreshToken(refresh_token);
    await this.tokenRepository.delete(findedTokenRecord.id);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    if (!token) {
      throw new UnauthorizedException('توکن یافت نشد.');
    }

    return type === 'Bearer' ? token : undefined;
  }

  async deleteExpiredTokens(): Promise<number> {
    const now = new Date();

    // Delete tokens where either access_token and refresh_token is expired
    const result = await this.tokenRepository.createQueryBuilder().delete().from(Token).where('access_token_expiration < :now', { now }).andWhere('refresh_token_expiration < :now', { now }).execute();

    return result.affected || 0;
  }
}
