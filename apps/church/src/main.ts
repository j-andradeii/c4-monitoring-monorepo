import { NestFactory } from '@nestjs/core';
import { ChurchModule } from './church.module';

async function bootstrap() {
  const app = await NestFactory.create(ChurchModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
