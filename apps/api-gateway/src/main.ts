import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { API_PREFIX } from '@app/libs';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:56435', 'https://gwc-monitoring-webapp.pages.dev', 'http://localhost:4202'],
    credentials: true,
  })
  app.setGlobalPrefix(API_PREFIX.API);  
  await app.listen(3000);
}
bootstrap();

