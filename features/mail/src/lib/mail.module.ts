import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      inject: [ConfigService], // Inject ConfigService
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>('SMTP_HOST'), // Fallback to 'smtp.gmail.com' if not provided
          port: configService.getOrThrow<number>('SMTP_PORT'), // Fallback to 465 if not provided
          secure: false, // true for 465, false for other ports
          auth: {
            user: configService.getOrThrow<string>('GMAIL_USER'), // your Gmail address
            pass: configService.getOrThrow<string>('GMAIL_PASSWORD'), // your Gmail password or app-specific password
          },
          tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"No Reply" <${configService.getOrThrow<string>('APP_NAME', 'No Reply')}>`, // Fallback to 'No Reply' if not provided
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
