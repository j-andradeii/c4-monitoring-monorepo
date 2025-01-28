import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ChurchModule } from './church.module';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ChurchModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'],
      queue: 'church_queue',
      queueOptions: {
        durable: false
      },
    },
  });
  await app.listen();
}
bootstrap();