import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { AuthMicroserviceModule } from './microservices/auth-microservice/auth-microservice.module';
import { AuthController } from './controllers/auth-controller';

@Module({
  imports: [
    AuthMicroserviceModule
  ],
  controllers: [
    ApiGatewayController,
    AuthController
  ],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
