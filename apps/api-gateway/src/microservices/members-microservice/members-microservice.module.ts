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
              urls: [process.env.RABBITMQ_URL],
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
