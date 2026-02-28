import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorLabels } from '../constants/error-labels';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: string = ErrorLabels.INTERNAL_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp['message'] as string) || exception.message;
        error = (resp['error'] as string) || this.getErrorLabel(status);

        // Handle class-validator array messages
        if (Array.isArray(resp['message'])) {
          message = (resp['message'] as string[]).join('; ');
          error = ErrorLabels.DATA_VALIDATION_FAILED;
        }
      }
    }

    response.status(status).json({
      success: false,
      error,
      message,
      statusCode: status,
    });
  }

  private getErrorLabel(status: number): string {
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return ErrorLabels.AUTH_UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorLabels.AUTH_FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorLabels.DATA_NOT_FOUND;
      case HttpStatus.BAD_REQUEST:
        return ErrorLabels.BAD_REQUEST;
      case HttpStatus.CONFLICT:
        return ErrorLabels.DATA_ALREADY_EXISTS;
      default:
        return ErrorLabels.INTERNAL_ERROR;
    }
  }
}
