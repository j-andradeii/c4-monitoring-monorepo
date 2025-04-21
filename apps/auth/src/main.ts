import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {

  const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://zT3GlkToRo2p50KG:.fmcZE78bOP1AtXD_GOdkqWz8.vCosDy@centerbeam.proxy.rlwy.net:19652'; // Default value fallback
  
  console.log(rabbitMqUrl);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: 'auth_queue',  // Ensure this queue name matches the one in the API Gateway
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.listen();
}
bootstrap();
