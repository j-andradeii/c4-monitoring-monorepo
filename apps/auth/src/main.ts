import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';


// Set a random fallback function for bcryptjs
bcrypt.setRandomFallback((length) => {
  // Use Node.js crypto module if available
  try {
    // Convert Buffer to regular array
    return Array.from(crypto.randomBytes(length));
  } catch (e) {
    // Fallback to a less secure but functional random generator
    const result = new Array(length);
    for (let i = 0; i < length; i++) {
      result[i] = Math.floor(Math.random() * 256);
    }
    return result;
  }
});



async function bootstrap() {

  let rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672'; // Default value fallback
  // Append frameMax directly to the URL as it seems socketOptions isn't working reliably here
  rabbitMqUrl = rabbitMqUrl.includes('?') ? `${rabbitMqUrl}&frameMax=8192` : `${rabbitMqUrl}?frameMax=8192`;

  console.log("rabbitMqUrl", rabbitMqUrl);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: 'auth_queue',  // Ensure this queue name matches the one in the API Gateway
      queueOptions: {
        durable: false,
      }
    },
  });

  await app.listen();
}
bootstrap();
