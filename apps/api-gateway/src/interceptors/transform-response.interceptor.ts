import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { map, catchError } from 'rxjs/operators';
  
  @Injectable()
  export class TransformResponseInterceptor<T>
    implements NestInterceptor<T, { data?: T; statusCode: number; error?: any }>
  {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<{ data?: T; statusCode: number; error?: any }> {
      const response = context.switchToHttp().getResponse();
  
      return next.handle().pipe(
        map((data) => ({
          data,
          statusCode: response.statusCode, // Capture HTTP status code
        })),
        catchError((error) => {
          // Extract status code if it's an HttpException
          let statusCode =
            error instanceof HttpException
              ? error.getStatus()
              : HttpStatus.INTERNAL_SERVER_ERROR;
  
          return throwError(() => ({
            statusCode,
            error: error.message || 'Internal Server Error',
          }));
        }),
      );
    }
  }
  