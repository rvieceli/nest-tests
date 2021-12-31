import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    console.log(message);

    response.status(status).json({
      statusCode: status,
      message,
      timestamps: new Date().toISOString(),
      path: request.url,
    });
  }
}

export { HttpExceptionFilter };
