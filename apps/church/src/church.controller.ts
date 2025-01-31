import { Controller, Get } from '@nestjs/common';
import { ChurchService } from './church.service';
import { MessagePattern } from '@nestjs/microservices';
import { CHURCH_COMMAND } from '@app/libs';
import { CommandBus } from '@nestjs/cqrs';
import { CreateChurchCommand } from './cqrs/commands/create-church-command';

@Controller()
export class ChurchController {
  constructor(private readonly churchService: ChurchService, private readonly commandBus: CommandBus,) {}

  @MessagePattern({ cmd: CHURCH_COMMAND.CREATE_CHURCH })
  async authenticate(data: any): Promise<any> {
    console.log("recieved-ChurchControllerchurch controller", CHURCH_COMMAND.CREATE_CHURCH);
    await this.commandBus.execute(new CreateChurchCommand(data));
    return {
      name: "Joseph andrade 10 church-1"
    };
  }
} 
