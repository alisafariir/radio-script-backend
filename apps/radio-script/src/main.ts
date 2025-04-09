/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { GlobalExceptionFilter, PayloadTooLargeFilter } from '@/filters';
async function bootstrap() {
  const globalPrefix = 'api';
  const defaultVersion = '1';
  const port = process.env.APP_PORT || 3001;

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const allowedOrigins = configService.get<string>('ALLOW_ORIGINS').split(',');

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters( new GlobalExceptionFilter())
  app.useGlobalFilters( new PayloadTooLargeFilter())

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

  await app.listen(port);
  Logger.log(`🚀 Application is running on:${port}/${globalPrefix}/v${defaultVersion}`);
}

bootstrap();
