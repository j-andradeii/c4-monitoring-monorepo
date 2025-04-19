import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ChurchModule } from './church.module';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';
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
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();
}
bootstrap();