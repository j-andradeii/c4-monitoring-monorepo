import { Module } from '@nestjs/common';
import { ChurchMicroserviceService } from './church-microservice.service';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    ClientsModule.register([
        {
            name: 'CHURCH_SERVICE',
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://user:password@rabbitmq:5672'],
              queue: 'church_queue',
              queueOptions: {
                durable: false,
              },
            },
          },
    ]),
  ],
  controllers: [],
  providers: [ChurchMicroserviceService],
  exports: [ChurchMicroserviceService]
})
export class ChurchMicroserviceModule {}