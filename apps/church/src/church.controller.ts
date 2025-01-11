import { Controller, Get } from '@nestjs/common';
import { ChurchService } from './church.service';

@Controller()
export class ChurchController {
  constructor(private readonly churchService: ChurchService) {}

  @Get()
  getHello(): string {
    return this.churchService.getHello();
  }
}
