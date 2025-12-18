import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { API_PREFIX } from '@app/libs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // Add cookie parser middleware
  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:4200', 
      'http://localhost:56435', 
      'https://gwc-monitoring-webapp.pages.dev', 
      'http://localhost:4202', 
      'http://localhost:4000',
      'http://localhost:3004',
      'http://localhost:3005',
      'https://gwc-monitoring-nextjs.vercel.app',
      'http://localhost:3100',
    ],
    credentials: true,
  })
  app.setGlobalPrefix(API_PREFIX.API);  
  await app.listen(3000);
}
bootstrap();

