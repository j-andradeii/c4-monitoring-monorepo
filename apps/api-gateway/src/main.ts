import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:56435'],
    credentials: true,
  })
  await app.listen(3000);
}
bootstrap();
