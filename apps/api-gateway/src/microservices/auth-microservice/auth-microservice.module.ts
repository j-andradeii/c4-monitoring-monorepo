import { Module } from '@nestjs/common';
import { AuthMicroserviceService } from './auth-microservice.service';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    ClientsModule.register([
        {
            name: 'AUTH_SERVICE',
            transport: Transport.RMQ,
            options: {
              urls: [process.env.RABBITMQ_URL],
              queue: 'auth_queue',
              queueOptions: {
                durable: false,
              },
            },
          },
    ]),
  ],
  controllers: [],
  providers: [AuthMicroserviceService],
  exports: [AuthMicroserviceService]
})
export class AuthMicroserviceModule {}