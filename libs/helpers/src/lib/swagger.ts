import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const basicAuth = require('express-basic-auth');
const SWAGGER_PATH = '/docs';

export const setupSwagger = (app: INestApplication) => {
  const swaggerPassword = app.get(ConfigService).getOrThrow('APP_SWAGGER_PASSWORD');

  if (process.env.NODE_ENV !== 'development') {
    app.use(
      [SWAGGER_PATH, `${SWAGGER_PATH}-json`],
      basicAuth({
        challenge: true,
        users: {
          admin: swaggerPassword,
        },
      })
    );
  }

  const config = new DocumentBuilder().build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);
};
