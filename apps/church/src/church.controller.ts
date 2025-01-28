import { Controller, Get } from '@nestjs/common';
import { ChurchService } from './church.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ChurchController {
  constructor(private readonly churchService: ChurchService) {}

  @MessagePattern({ cmd: 'church_authenticate' })
  async authenticate(data: any): Promise<any> {
    console.log("recieved-ChurchControllerchurch controller");
    return {
      name: "Joseph andrade 10 church"
    };
  }
} 
