import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | object = isHttpException ? exception.getResponse() : (exception as any)?.message || 'Internal server error';

    if (status === HttpStatus.PAYLOAD_TOO_LARGE) {
      message = 'حجم فایل ارسالی شما بزرگتر از حد مجاز است. لطفاً فایل کوچکتری ارسال کنید.';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? message : (message as any)?.message || message,
    };

    response.status(status).json(errorResponse);
  }
}
