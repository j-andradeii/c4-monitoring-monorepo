import { Controller, Get } from '@nestjs/common';
import { ChurchService } from './church.service';
import { MessagePattern } from '@nestjs/microservices';
import { CHURCH_COMMAND } from '@app/libs';

@Controller()
export class ChurchController {
  constructor(private readonly churchService: ChurchService) {}

  @MessagePattern({ cmd: CHURCH_COMMAND.CREATE_CHURCH })
  async authenticate(data: any): Promise<any> {
    console.log("recieved-ChurchControllerchurch controller", CHURCH_COMMAND.CREATE_CHURCH);
    return {
      name: "Joseph andrade 10 church-1"
    };
  }
} 
