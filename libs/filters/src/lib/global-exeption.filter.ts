import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly configService: ConfigService // ✅ Inject ConfigService
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const i18n = I18nContext.current(host);
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | object = isHttpException ? exception.getResponse() : (exception as any)?.message || 'Internal server error';

    if (status === HttpStatus.PAYLOAD_TOO_LARGE) {
      message = 'validation.FILE_TOO_LARGE';
    }

    // ✅ Get default language from ConfigService
    const defaultLang = this.configService.get<string>('APP_DEFAULT_LANG', 'fa');
    const lang = defaultLang || i18n?.lang;

    let translatedMessage: string | string[] | object = message;

    if (typeof message === 'object' && i18n) {
      const rawMessage = (message as any)?.message;
      if (Array.isArray(rawMessage)) {
        translatedMessage = rawMessage.map((msg: string) => i18n.t(msg, { lang }) || msg);
      } else if (typeof rawMessage === 'string') {
        translatedMessage = i18n.t(rawMessage, { lang }) || rawMessage;
      }
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: translatedMessage,
    };

    response.status(status).json(errorResponse);
  }
}
