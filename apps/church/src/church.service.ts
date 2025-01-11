import { Injectable } from '@nestjs/common';

@Injectable()
export class ChurchService {
  getHello(): string {
    return 'Hello World!';
  }
}
