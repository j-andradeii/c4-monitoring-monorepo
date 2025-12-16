import { Module } from '@nestjs/common';
import { AuthMicroserviceService } from './auth-microservice.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiCryptoService } from '../../service/api-crypto-service';

let rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672'; // Default value fallback
// Append frameMax directly to the URL - THIS IS THE EFFECTIVE METHOD
rabbitMqUrl = rabbitMqUrl.includes('?') ? `${rabbitMqUrl}&frameMax=8192` : `${rabbitMqUrl}?frameMax=8192`;


@Module({
  imports: [
    ClientsModule.register([
        {
            name: 'AUTH_SERVICE',
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMqUrl],
              queue: 'auth_queue',
              queueOptions: {
                durable: false,
              }
            },
          },
    ]),
  ],
  controllers: [],
  providers: [AuthMicroserviceService, ApiCryptoService],
  exports: [AuthMicroserviceService]
})
export class AuthMicroserviceModule {}