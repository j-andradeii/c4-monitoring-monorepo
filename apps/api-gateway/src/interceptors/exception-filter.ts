import {
    Catch,
    ArgumentsHost,
    ExceptionFilter,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status =
        exception 
          ? exception.status ||  exception.statusCode
          : HttpStatus.INTERNAL_SERVER_ERROR;
      response.status(status).json({
        data: null,
        statusCode: status,
        error: exception.message || exception.error || 'Internal Server Error',
      });
    }
  }
  