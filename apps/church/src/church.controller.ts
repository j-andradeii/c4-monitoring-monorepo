import { Controller, Get } from '@nestjs/common';
import { ChurchService } from './church.service';
import { MessagePattern } from '@nestjs/microservices';
import { CHURCH_COMMAND, ChurchCampusCreationDto, PaginationDto } from '@app/libs';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateChurchCommand } from './cqrs/commands/create-church-command';
import { CreateChurchCampusCommand } from './cqrs/commands/create-church-campus-command';
import { GetChurchesQuery } from './cqrs/queries/get-churches.query';

@Controller()
export class ChurchController {
  constructor(private readonly churchService: ChurchService, private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus) {}

  @MessagePattern({ cmd: CHURCH_COMMAND.CREATE_CHURCH })
  async authenticate(data: any): Promise<any> {
    await this.commandBus.execute(new CreateChurchCommand(data));
    return {
      name: "Joseph andrade 10 church-1"
    };
  }

  @MessagePattern({ cmd: CHURCH_COMMAND.GET_CHURCH_CAMPUS_BY_ID })
  async getChurchCampusById(id: string): Promise<any> {
    return id;
  }

  @MessagePattern({ cmd: CHURCH_COMMAND.CREATE_CHURCH_CAMPUS })
  async createChurchCampus(data: ChurchCampusCreationDto): Promise<any> {
    return await this.commandBus.execute(new CreateChurchCampusCommand(data));
  }

  @MessagePattern({ cmd: CHURCH_COMMAND.GET_CHURCHES })
  async getChurches(data: PaginationDto): Promise<any> {
    return await this.queryBus.execute(new GetChurchesQuery(data));
  }


  
} 
