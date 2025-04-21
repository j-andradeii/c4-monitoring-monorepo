import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ChurchModule } from './church.module';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';
async function bootstrap() {

  let rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672'; // Default value fallback
  // Append frameMax directly to the URL as it seems socketOptions isn't working reliably here
  rabbitMqUrl = rabbitMqUrl.includes('?') ? `${rabbitMqUrl}&frameMax=8192` : `${rabbitMqUrl}?frameMax=8192`;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ChurchModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: 'church_queue',
      queueOptions: {
        durable: false
      }
    },
  });
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();
}
bootstrap();