import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomNumberGeneratorService {
  generateUnique8DigitNumber(): string {
    const random = Math.floor(10000000 + Math.random() * 90000000);
    return `${Date.now()}${random}`;
  }
}