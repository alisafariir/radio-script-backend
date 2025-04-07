import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class PayloadTooLargeFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.PAYLOAD_TOO_LARGE) {
      response.status(status).json({
        statusCode: status,
        message: 'حجم فایل ارسالی شما بزرگتر از حد مجاز است. لطفاً فایل کوچکتری ارسال کنید.', // Custom message
        error: 'حجم فایل ارسالی شما بزرگتر از حد مجاز است. لطفاً فایل کوچکتری ارسال کنید.',
      });
      return;
    }
  }
}
