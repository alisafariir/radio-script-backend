import { AuthModule } from '@/auth';
import { DatabaseModule } from '@/database';
import { EnvironmentModule } from '@/environments';
import { EncryptionService, OtpService } from '@/helpers';
import { MailModule } from '@/mail';
import { MediaModule } from '@/media';
import { OtpModule } from '@/otp';
import { SmsModule } from '@/sms';
import { TokenModule } from '@/token';
import { UserModule } from '@/user';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    EnvironmentModule,
    DatabaseModule,
    AuthModule,
    MailModule,
    MediaModule,
    OtpModule,
    SmsModule,
    TokenModule,
    UserModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EncryptionService,
    OtpService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
