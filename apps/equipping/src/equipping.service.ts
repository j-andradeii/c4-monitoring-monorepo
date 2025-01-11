import { Injectable } from '@nestjs/common';

@Injectable()
export class EquippingService {
  getHello(): string {
    return 'Hello World!';
  }
}
