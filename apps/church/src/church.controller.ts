import { Controller, Get } from '@nestjs/common';
import { ChurchService } from './church.service';
import { MessagePattern } from '@nestjs/microservices';
import { CHURCH_COMMAND, ChurchCampusCreationDto } from '@app/libs';
import { CommandBus } from '@nestjs/cqrs';
import { CreateChurchCommand } from './cqrs/commands/create-church-command';
import { CreateChurchCampusCommand } from './cqrs/commands/create-church-campus-command';

@Controller()
export class ChurchController {
  constructor(private readonly churchService: ChurchService, private readonly commandBus: CommandBus,) {}

  @MessagePattern({ cmd: CHURCH_COMMAND.CREATE_CHURCH })
  async authenticate(data: any): Promise<any> {
    await this.commandBus.execute(new CreateChurchCommand(data));
    return {
      name: "Joseph andrade 10 church-1"
    };
  }

  @MessagePattern({ cmd: CHURCH_COMMAND.CREATE_CHURCH_CAMPUS })
  async createChurchCampus(data: ChurchCampusCreationDto): Promise<any> {
    console.log(data);
    await this.commandBus.execute(new CreateChurchCampusCommand(data));
    return {
      name: "Church Campus Creation Dto"
    };
  }
} 
