import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomNumberGeneratorService {
  private usedNumbers = new Set<number>();

  generateUnique8DigitNumber(): string {
    let number;
    do {
      number = Math.floor(10000000 + Math.random() * 90000000);
    } while (this.usedNumbers.has(number));

    this.usedNumbers.add(number);
    return `${number}`;
  }
}