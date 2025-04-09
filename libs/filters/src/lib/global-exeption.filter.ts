// src/common/filters/global-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let message: string | object;
    let error: string;
    let validationErrors: string[] = [];

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message = exceptionResponse['message'] || exceptionResponse;
        error = exceptionResponse['error'] || exception.name;

        // Handle class-validator errors
        if (Array.isArray(message)) {
          validationErrors = message;
          message = 'Validation failed';
        }
      } else {
        message = exceptionResponse;
        error = exception.name;
      }
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = 'Database query failed';
      error = 'Database Error';
      this.logger.error(`Database error: ${exception.message}`, exception.stack);
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Internal server error';
      error = 'Internal Server Error';
      this.logger.error(`Internal error: ${exception.message}`, exception.stack);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'Internal Server Error';
    }

    if (status === HttpStatus.PAYLOAD_TOO_LARGE) {
      response.status(status).json({
        statusCode: status,
        message: 'حجم فایل ارسالی شما بزرگتر از حد مجاز است. لطفاً فایل کوچکتری ارسال کنید.', // Custom message
        error: 'حجم فایل ارسالی شما بزرگتر از حد مجاز است. لطفاً فایل کوچکتری ارسال کنید.',
      });
      return;
    }

    // Log the error
    this.logger.error(
      `Error: ${status} - ${message}` +
        (validationErrors.length > 0 ? ` | Details: ${validationErrors.join(', ')}` : '') +
        ` | Path: ${request.url}` +
        ` | Stack: ${exception instanceof Error ? exception.stack : ''}`
    );

    // Send the response
    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(validationErrors.length > 0 && { details: validationErrors }),
    });
  }
}
