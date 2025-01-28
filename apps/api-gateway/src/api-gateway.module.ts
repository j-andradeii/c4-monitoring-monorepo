import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { AuthMicroserviceModule } from './microservices/auth-microservice/auth-microservice.module';
import { AuthController } from './controllers/auth/auth-controller';
import { ChurchMicroserviceModule } from './microservices/church-microservice/church-microservice.module';
import { ChurchController } from './controllers/church/church-controller';

@Module({
  imports: [
    AuthMicroserviceModule,
    ChurchMicroserviceModule
  ],
  controllers: [
    ApiGatewayController,
    AuthController,
    ChurchController
  ],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
