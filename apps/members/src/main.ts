import { NestFactory } from '@nestjs/core';
import { MembersModule } from './members.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';

async function bootstrap() {

  let rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672'; // Default value fallback
  // Append frameMax directly to the URL as it seems socketOptions isn't working reliably here
  rabbitMqUrl = rabbitMqUrl.includes('?') ? `${rabbitMqUrl}&frameMax=8192` : `${rabbitMqUrl}?frameMax=8192`;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MembersModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: 'members_queue',
      queueOptions: {
        durable: false
      }
    },
  });
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();
}
bootstrap();
