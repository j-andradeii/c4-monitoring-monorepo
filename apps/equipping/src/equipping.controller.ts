import { Controller, Get } from '@nestjs/common';
import { EquippingService } from './equipping.service';

@Controller()
export class EquippingController {
  constructor(private readonly equippingService: EquippingService) {}

  @Get()
  getHello(): string {
    return this.equippingService.getHello();
  }
}
