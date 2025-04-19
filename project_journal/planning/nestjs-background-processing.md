# Background Processing in NestJS

NestJS offers several approaches for background processing, similar to Symfony's async consume functionality. Here's a comprehensive overview of the options available:

## 1. Task Scheduling with `@nestjs/schedule`

NestJS provides a built-in scheduling module that allows you to run tasks at specified intervals or at specific times.

### Installation

```bash
npm install --save @nestjs/schedule
```

### Setup

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // other modules
  ],
})
export class AppModule {}
```

### Usage

```typescript
// tasks.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  // Run every 10 seconds
  @Interval(10000)
  handleInterval() {
    console.log('Called every 10 seconds');
    // Process background tasks
  }

  // Run at specific times (cron syntax)
  @Cron('0 0 * * *') // Midnight every day
  handleCron() {
    console.log('Called once at midnight');
    // Process daily tasks
  }

  // Run once after a delay
  @Timeout(5000)
  handleTimeout() {
    console.log('Called once after 5 seconds');
    // Process delayed task
  }
}
```

**Limitations**: This approach is suitable for scheduled tasks but not ideal for processing queued jobs or handling high-throughput background processing.

## 2. Queue Processing with Bull

Bull is a Redis-based queue for Node.js that integrates well with NestJS through the `@nestjs/bull` package.

### Installation

```bash
npm install --save @nestjs/bull bull
npm install --save-dev @types/bull
```

### Setup

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    // Register queues
    BullModule.registerQueue({
      name: 'emails',
    }),
    // other modules
  ],
})
export class AppModule {}
```

### Producer (Adding Jobs to Queue)

```typescript
// email.service.ts
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('emails') private emailsQueue: Queue) {}

  async sendWelcomeEmail(user: any) {
    // Add job to queue (will be processed in background)
    await this.emailsQueue.add('welcome', {
      user,
      timestamp: new Date(),
    }, {
      // Optional job options
      priority: 1, // Higher priority
      delay: 5000, // Delay 5 seconds
      attempts: 3, // Retry 3 times if fails
    });
    
    return { success: true, message: 'Welcome email queued' };
  }
}
```

### Consumer (Processing Jobs)

```typescript
// email.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('emails')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process('welcome')
  async handleWelcomeEmail(job: Job) {
    this.logger.debug('Processing welcome email job');
    this.logger.debug(`Job data: ${JSON.stringify(job.data)}`);
    
    try {
      // Actual email sending logic
      await this.sendActualEmail(job.data.user);
      this.logger.log(`Welcome email sent to ${job.data.user.email}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to send welcome email: ${error.message}`);
      throw error; // Will trigger retry if attempts remaining
    }
  }
  
  private async sendActualEmail(user: any) {
    // Implementation of actual email sending
    // This runs in the background
  }
}
```

**Benefits**:
- Reliable job processing with retries
- Job prioritization
- Delayed execution
- Persistent queue (survives app restarts)
- Distributed processing (multiple workers)
- Monitoring and metrics

## 3. Event-Based Processing with EventEmitter2

NestJS has a built-in event system based on `EventEmitter2`.

### Setup

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    // other modules
  ],
})
export class AppModule {}
```

### Event Producer

```typescript
// user.service.ts
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserService {
  constructor(private eventEmitter: EventEmitter2) {}

  async createUser(userData: any) {
    // Create user logic
    const user = await this.usersRepository.save(userData);
    
    // Emit event for background processing
    this.eventEmitter.emit('user.created', user);
    
    return user;
  }
}
```

### Event Consumer

```typescript
// user-notifications.service.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UserNotificationsService {
  @OnEvent('user.created')
  async handleUserCreatedEvent(user: any) {
    // Background processing logic
    await this.sendWelcomeEmail(user);
    await this.setupUserDefaults(user);
    // etc.
  }
  
  private async sendWelcomeEmail(user: any) {
    // Email sending logic
  }
  
  private async setupUserDefaults(user: any) {
    // Setup default settings, etc.
  }
}
```

**Limitations**: This approach is in-memory and not persistent. If your application crashes, any unprocessed events will be lost.

## 4. Microservice Event Patterns

NestJS Microservices support event-based communication patterns that can be used for background processing.

### Setup

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS, // or RabbitMQ, Kafka, etc.
      options: {
        host: 'localhost',
        port: 6379,
      },
    },
  );
  await app.listen();
}
bootstrap();
```

### Event Producer

```typescript
// in another service or API gateway
import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SomeService {
  constructor(
    @Inject('PROCESSING_SERVICE') private client: ClientProxy,
  ) {}

  async triggerBackgroundProcess(data: any) {
    // Fire and forget (doesn't wait for response)
    this.client.emit('process_data', data);
    return { queued: true };
  }
}
```

### Event Consumer

```typescript
// in the microservice
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class ProcessingController {
  @EventPattern('process_data')
  async handleProcessData(data: any) {
    // Background processing logic
    console.log('Processing data in background:', data);
    await this.someTimeConsumingTask(data);
  }
  
  private async someTimeConsumingTask(data: any) {
    // Implementation
  }
}
```

## 5. Dedicated Worker Threads

For CPU-intensive tasks, you can use Node.js Worker Threads.

```typescript
// worker.service.ts
import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import * as path from 'path';

@Injectable()
export class WorkerService {
  async processInBackground(data: any) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        path.resolve(__dirname, 'workers', 'cpu-intensive.worker.js'),
        { workerData: data }
      );
      
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
}
```

## Comparison with Symfony's Async Consume

Symfony's Messenger component with async transport is most similar to the Bull queue approach in NestJS. Both provide:

1. **Persistence**: Messages/jobs are stored until processed
2. **Retries**: Failed jobs can be retried
3. **Separate Worker Processes**: Jobs are processed by dedicated workers
4. **Multiple Queues**: Different types of jobs can be routed to different queues

## Recommendation

For a robust background processing system in NestJS that's most similar to Symfony's async consume:

1. **Use Bull Queue** for reliable, persistent job processing
2. **Implement a dedicated worker** that runs separately from your main application
3. **Set up monitoring** for your queues to track job processing

Example worker setup:

```typescript
// worker.ts
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);
  await app.init();
}
bootstrap();
```

Run this worker process separately from your main application:

```bash
# Main application
node dist/main.js

# Worker process
node dist/worker.js
```

This approach gives you the most robust and scalable background processing system in NestJS.