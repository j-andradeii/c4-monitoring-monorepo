import { NestFactory } from '@nestjs/core';
import { EquippingModule } from './equipping.module';

async function bootstrap() {
  const app = await NestFactory.create(EquippingModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
