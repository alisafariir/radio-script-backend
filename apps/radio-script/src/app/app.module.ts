import { AuthModule } from '@/auth';
import { DatabaseModule } from '@/database';
import { EnvironmentModule } from '@/environments';
import { HealthModule } from '@/health';
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
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
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
    AuthModule,
    HealthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30,
      },
    ]),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [{ use: AcceptLanguageResolver, options: ['lang', 'locale', 'l'] }],
    }),
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
