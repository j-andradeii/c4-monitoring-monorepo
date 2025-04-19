import { Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    let status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    
    // Handle HttpExceptions (BadRequestException, NotFoundException, etc.)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message = (errorResponse as any).message || exception.message;
      error = (errorResponse as any).error || 'Error';
    } else if (exception.message) {
      message = exception.message;
    }
    
    // Create a structured error response
    return throwError(() => ({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: host.getArgByIndex(0)?.cmd || 'unknown',
    }));
  }
}