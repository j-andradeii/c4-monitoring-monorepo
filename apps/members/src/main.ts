import { NestFactory } from '@nestjs/core';
import { MembersModule } from './members.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';

async function bootstrap() {

  const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672'; // Default value fallback

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MembersModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: 'members_queue',
      queueOptions: {
        durable: false
      },
    },
  });
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();
}
bootstrap();
