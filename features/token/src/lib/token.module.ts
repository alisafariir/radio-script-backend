import { Token, User } from '@/entities';
import { JwtStrategy, RefreshTokenStrategy } from '@/strategies';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenCleanupScheduler } from './token-cleanup.scheduler';
import { TokenService } from './token.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Token, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET_KEY'),
      }),
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [TokenService, JwtService, JwtStrategy, RefreshTokenStrategy, TokenCleanupScheduler],
  exports: [TokenService],
})
export class TokenModule {}
