# Error Propagation Between NestJS Microservices

## Problem: Error Details Lost Between Microservices

When using NestJS microservices architecture with message patterns, errors thrown in a microservice (like `BadRequestException`) are not properly propagated to the API Gateway. Instead, they are transformed into generic "Internal Server Error" responses, losing valuable error details, status codes, and context.

## Current Implementation

### Church Microservice (Producer)

```typescript
@MessagePattern({ cmd: CHURCH_COMMAND.GET_CHURCH_CAMPUS_BY_ID })
async getChurchCampusById(id: string): Promise<any> {
  try {
    return await this.queryBus.execute(new GetChurchCampusByIdQuery(id));
  } catch(error) {
    console.log("getChurchCampusById---", error);
    throw error; // Error thrown here (e.g., BadRequestException)
  }
}
```

### API Gateway (Consumer)

```typescript
async getChurchCampusById(id: string) {
  try {
    const churchCampusResponse = this.churchClient.send(
      {cmd: CHURCH_COMMAND.GET_CHURCH_CAMPUS_BY_ID},
      id
    );
    return await lastValueFrom(churchCampusResponse);
  } catch(error) {
    console.log("getChurchCampusById", error);
    throw error; // Receives generic RpcException or Error object
  }
}
```

## Root Cause Analysis

The issue occurs because:

1. **Serialization/Deserialization**: When an exception is thrown in a microservice, it gets serialized over the transport layer (TCP, Redis, RabbitMQ, etc.). During this process, the exception's class information and metadata are lost.

2. **RpcException Wrapping**: NestJS wraps all microservice exceptions in an `RpcException` by default, which doesn't preserve the original exception type or status code.

3. **Observable Handling**: The `lastValueFrom()` operator catches errors from the observable but doesn't have the context to reconstruct the original exception type.

## Solutions

### 1. Custom Exception Filter in Microservice (Recommended)

Create a custom exception filter in the microservice that transforms exceptions into a structured error response object:

```typescript
// apps/church/src/filters/rpc-exception.filter.ts
import { Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
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
```

Apply this filter globally in the microservice:

```typescript
// apps/church/src/main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP, // Or your chosen transport
      options: { /* transport options */ },
    },
  );
  
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();
}
bootstrap();
```

### 2. Error Handling in API Gateway

Enhance the API Gateway to handle the structured error responses:

```typescript
// apps/api-gateway/src/service/church-service.ts
async getChurchCampusById(id: string) {
  try {
    const churchCampusResponse = this.churchClient.send(
      {cmd: CHURCH_COMMAND.GET_CHURCH_CAMPUS_BY_ID},
      id
    );
    return await lastValueFrom(churchCampusResponse);
  } catch(error) {
    console.log("getChurchCampusById", error);
    
    // Check if it's our structured error response
    if (error && error.statusCode) {
      // Reconstruct the appropriate exception based on status code
      switch (error.statusCode) {
        case HttpStatus.BAD_REQUEST:
          throw new BadRequestException(error.message);
        case HttpStatus.NOT_FOUND:
          throw new NotFoundException(error.message);
        case HttpStatus.FORBIDDEN:
          throw new ForbiddenException(error.message);
        // Add other status codes as needed
        default:
          throw new HttpException(error.message, error.statusCode);
      }
    }
    
    // Fallback for unhandled errors
    throw error;
  }
}
```

### 3. Create a Shared Exception Handling Library (Advanced)

For larger systems with many microservices, create a shared library for consistent error handling:

```typescript
// libs/common/src/exceptions/rpc-exception.filter.ts
// (Same implementation as above)

// libs/common/src/exceptions/error-handler.ts
export function handleMicroserviceError(error: any) {
  if (error && error.statusCode) {
    // Implementation similar to API Gateway error handling above
  }
  throw new InternalServerErrorException('An unexpected error occurred');
}
```

Then use this in all microservices and the API Gateway:

```typescript
// In microservice main.ts
import { RpcExceptionFilter } from '@app/common/exceptions/rpc-exception.filter';
app.useGlobalFilters(new RpcExceptionFilter());

// In API Gateway services
import { handleMicroserviceError } from '@app/common/exceptions/error-handler';
try {
  return await lastValueFrom(response$);
} catch (error) {
  return handleMicroserviceError(error);
}
```

## Additional Considerations

### 1. Transport-Specific Behavior

Different transports (TCP, Redis, RabbitMQ, Kafka, etc.) may handle errors differently. For example:

- **TCP/Redis**: These transports use request-reply patterns and can propagate errors more directly.
- **RabbitMQ/Kafka**: These message-based transports require more careful error handling, especially for event-based communication.

### 2. Timeout Handling

Add timeout handling to prevent hanging requests:

```typescript
import { timeout, catchError } from 'rxjs/operators';

const response$ = this.churchClient.send(pattern, data).pipe(
  timeout(5000), // 5 second timeout
  catchError(err => {
    if (err.name === 'TimeoutError') {
      throw new RequestTimeoutException('Service request timed out');
    }
    throw err;
  })
);
```

### 3. Circuit Breaker Pattern

For production systems, consider implementing the Circuit Breaker pattern to handle service degradation gracefully:

```typescript
// Using a library like 'opossum' for circuit breaking
const circuitBreaker = new CircuitBreaker(
  async () => {
    return await lastValueFrom(this.churchClient.send(pattern, data));
  },
  {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
  }
);

try {
  return await circuitBreaker.fire();
} catch (error) {
  // Handle circuit breaker errors
}
```

## Conclusion

The most effective approach is to implement a custom exception filter in the microservice that transforms exceptions into structured error objects with preserved status codes and messages. Then, enhance the API Gateway to reconstruct appropriate exceptions based on this structured information.

This approach maintains the original error context while working within the constraints of the microservices communication model, ensuring that clients receive meaningful error responses rather than generic server errors.