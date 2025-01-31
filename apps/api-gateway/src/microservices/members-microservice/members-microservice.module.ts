import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MembersMicroserviceService } from './members-microservice.service';

@Module({
  imports: [
    ClientsModule.register([
        {
            name: 'MEMBERS_SERVICE',
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://user:password@rabbitmq:5672'],
              queue: 'members_queue',
              queueOptions: {
                durable: false,
              },
            },
          },
    ]),
  ],
  controllers: [],
  providers: [MembersMicroserviceService],
  exports: [MembersMicroserviceService]
})
export class MembersMicroserviceModule {}
