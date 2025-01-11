import { Module } from '@nestjs/common';
import { EquippingController } from './equipping.controller';
import { EquippingService } from './equipping.service';

@Module({
  imports: [],
  controllers: [EquippingController],
  providers: [EquippingService],
})
export class EquippingModule {}
