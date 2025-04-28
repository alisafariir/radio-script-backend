import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const i18n = I18nContext.current(host);
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // می‌گیریم پیام خام رو
    const rawResponse = isHttpException ? exception.getResponse() : { message: (exception as any)?.message || 'Internal server error' };

    // استخراج پیام (ممکنه رشته یا آرایه باشه)
    let messages: string[] = [];
    if (typeof rawResponse === 'object') {
      const m = (rawResponse as any).message;
      messages = Array.isArray(m) ? m : [m];
    } else {
      messages = [String(rawResponse)];
    }

    // ترجمه‌ی هر پیام (در صورت نیاز)
    const defaultLang = this.configService.get<string>('APP_DEFAULT_LANG', 'fa');
    const lang = defaultLang || i18n?.lang;

    const translated = messages.map((msg) => (typeof msg === 'string' && i18n ? i18n.t(msg, { lang }) || msg : String(msg)));

    // تبدیل آرایه به رشته با جداکننده‌ی دلخواه
    // برای جداکننده با کاما:
    const joinedWithComma = translated.join(', ');
    // یا برای هر پیام در خط جدید:
    // const joinedWithNewline = translated.join('\n');

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      // اینجا یکی از دو مورد بالا را انتخاب کنید:
      message: joinedWithComma,
    };

    response.status(status).json(errorResponse);
  }
}
