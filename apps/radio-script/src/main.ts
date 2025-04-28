/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { GlobalExceptionFilter } from '@/filters';
import { setupSwagger } from '@/helpers';
import { TranslateInterceptor } from '@/interceptors';
import { ClassSerializerInterceptor, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const globalPrefix = 'api';
  const defaultVersion = '1';
  const port = process.env.APP_PORT || 3001;

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const allowedOrigins = configService.getOrThrow<string>('APP_ALLOW_ORIGINS').split(',');

  app.useGlobalPipes(
    new ValidationPipe(),
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  app.useGlobalFilters(
    new GlobalExceptionFilter(configService),
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    })
  );

  app.useGlobalInterceptors(new TranslateInterceptor(), new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(cookieParser());

  app.setGlobalPrefix(globalPrefix);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion,
  });

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  setupSwagger(app);

  await app.listen(port);
  Logger.log(`🚀 Application is running on:${port}/${globalPrefix}/v${defaultVersion}`);
}

bootstrap();
