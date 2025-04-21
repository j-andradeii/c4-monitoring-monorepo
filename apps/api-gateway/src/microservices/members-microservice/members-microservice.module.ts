import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MembersMicroserviceService } from './members-microservice.service';
          
let rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672'; // Default value fallback
// Append frameMax directly to the URL - THIS IS THE EFFECTIVE METHOD
rabbitMqUrl = rabbitMqUrl.includes('?') ? `${rabbitMqUrl}&frameMax=8192` : `${rabbitMqUrl}?frameMax=8192`;
@Module({
  imports: [
    ClientsModule.register([
        {
            name: 'MEMBERS_SERVICE',
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMqUrl],
              queue: 'members_queue',
              queueOptions: {
                durable: false,
              }
            },
          },
    ]),
  ],
  controllers: [],
  providers: [MembersMicroserviceService],
  exports: [MembersMicroserviceService]
})
export class MembersMicroserviceModule {}
