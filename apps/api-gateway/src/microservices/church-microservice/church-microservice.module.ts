import { Module } from '@nestjs/common';
import { ChurchMicroserviceService } from './church-microservice.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

let rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672'; // Default value fallback
// Append frameMax directly to the URL - THIS IS THE EFFECTIVE METHOD
rabbitMqUrl = rabbitMqUrl.includes('?') ? `${rabbitMqUrl}&frameMax=8192` : `${rabbitMqUrl}?frameMax=8192`;
@Module({
  imports: [
    ClientsModule.register([
        {
            name: 'CHURCH_SERVICE',
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMqUrl],
              queue: 'church_queue',
              queueOptions: {
                durable: false,
              }
            },
          },
    ]),
  ],
  controllers: [],
  providers: [ChurchMicroserviceService],
  exports: [ChurchMicroserviceService]
})
export class ChurchMicroserviceModule {}