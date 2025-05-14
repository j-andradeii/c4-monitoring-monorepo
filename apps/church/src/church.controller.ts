import { Controller, Get } from '@nestjs/common';
import { ChurchService } from './church.service';
import { MessagePattern } from '@nestjs/microservices';
import { CHURCH_COMMAND, ChurchCampusCreationDto, PaginationDto } from '@app/libs';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateChurchCommand } from './cqrs/commands/create-church-command';
import { CreateChurchCampusCommand } from './cqrs/commands/create-church-campus-command';
import { GetChurchesQuery } from './cqrs/queries/get-churches.query';
import { GetChurchCampusByIdQuery } from './cqrs/queries/get-church-campus-by-id-query';
import { CreateChurchCampusStaffCommand } from './cqrs/commands/create-church-campus-staff.command';
import { ChurchCampusDto } from '@app/libs/dto/church/church-campus.dto';
import { GetChuchCampusStaffsQuery } from './cqrs/queries/get-church-campus-staffs.query';
import { GetChurchCampusStaffByMemberId } from './cqrs/queries/get-church-campus-staff-by-member-id.query';

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

  

  @MessagePattern({ cmd: CHURCH_COMMAND.GET_CHURCH_CAMPUS_STAFF_BY_MEMBER_ID })
  async getChurchCampusStaffByMemberId(data: any): Promise<any> {
    try {
      return await this.queryBus.execute(new GetChurchCampusStaffByMemberId(data.member_id));
    } catch(error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: CHURCH_COMMAND.HEALTH_CHECK })
  async healthCheck(data: any): Promise<any> {
    return {
      name: "CHURCH MICROSERVICES IS REACHABLE"
    };
  }

  @MessagePattern({ cmd: CHURCH_COMMAND.GET_CHURCH_CAMPUS_BY_ID })
  async getChurchCampusById(id: string): Promise<ChurchCampusDto> {
    try {
      return await this.queryBus.execute(new GetChurchCampusByIdQuery(id));
    } catch(error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: CHURCH_COMMAND.GET_CHURCH_CAMPUS_STAFFS })
  async getChuchCampusStaffs(data: any){
    try {
      return await this.queryBus.execute(new GetChuchCampusStaffsQuery(data.church_campus_id, {page: data.page, limit: data.limit}));
    } catch(error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: CHURCH_COMMAND.GET_CHURCHES })
  async getChurches(data: PaginationDto): Promise<any> {
    return await this.queryBus.execute(new GetChurchesQuery(data));
  }


  @MessagePattern({ cmd: CHURCH_COMMAND.CREATE_CHURCH_CAMPUS })
  async createChurchCampus(data: ChurchCampusCreationDto): Promise<any> {
    return await this.commandBus.execute(new CreateChurchCampusCommand(data));
  }


  @MessagePattern({ cmd: CHURCH_COMMAND.CREATE_CHURCH_CAMPUS_STAFF })
  async createChurchCampusStaff(data: any): Promise<any> {
    try {
      return await this.commandBus.execute(new CreateChurchCampusStaffCommand(data));
    } catch(error) {
      throw error;
    }
  }

} 
