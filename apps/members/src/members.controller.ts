import { Controller, Get } from '@nestjs/common';
import { MembersService } from './members.service';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateChurchCampusMemberClosureCommand } from './cqrs/commands/create-church-campus-member-closure.command';
import { MEMBER_COMMAND } from '@app/libs';
import { MemberCreationDto } from '@app/libs/dto/member/member.creation.dto';
import { CreateMemberCommand } from './cqrs/commands/create-member.command';
import { FallbackCreateMemberCommand } from './cqrs/commands/fallback-create-member.command';
import { GetMembersByIdsQuery } from './cqrs/queries/get-members-by-ids-query';
import { GetMemberByAuthIdQuery } from './cqrs/queries/get-member-by-auth-id.query';
import { GetMembersQuery } from './cqrs/queries/get-members-query';
@Controller()
export class MembersController {
  constructor(private readonly membersService: MembersService,
              private readonly commandBus: CommandBus,
              private readonly queryBus: QueryBus) {}

  @MessagePattern({ cmd: 'members_authenticate' })
  async authenticate(data: any): Promise<any> {
    console.log("recieved-MembersControllermembers controller1", data);
    return {
      name: "Joseph andrade 10 members-microservice"
    };
  }


  @MessagePattern({cmd: MEMBER_COMMAND.GET_MEMBER_BY_AUTH_ID})
  async getMemberByAuthId(data:any) {
    try {
      return await this.queryBus.execute(new GetMemberByAuthIdQuery(data.auth_id));
    } catch(error) {
      throw error;
    }
  }


  @MessagePattern({cmd: MEMBER_COMMAND.GET_MEMBERS})
  async getMembers(data:any) {
    try {
      return await this.queryBus.execute(new GetMembersQuery(data));
    } catch(error) {
      throw error;
    }
  }


  @MessagePattern({cmd: MEMBER_COMMAND.GET_MEMBERS_BY_IDS})
  async getMembersByIds(data:any) {
    try {
      return await this.queryBus.execute(new GetMembersByIdsQuery(data));
    } catch(error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'create_church_campus_closure' })
  async createChurchCampusClosure(data: any): Promise<any> {
    return await this.commandBus.execute(new CreateChurchCampusMemberClosureCommand(data.referenceId));
  }


  @MessagePattern({cmd: MEMBER_COMMAND.CREATE_MEMBER})
  async createMember(data: MemberCreationDto) {
    try {
      return await this.commandBus.execute(new CreateMemberCommand(data));
    } catch(error) {
      throw error;
    }
  }

  @MessagePattern({cmd: MEMBER_COMMAND.FALLBACK_CREATE_MEMBER})
  async fallbackCreateMember(data: string) {
    try {
      return await this.commandBus.execute(new FallbackCreateMemberCommand(data));
    } catch(error) {
      throw error;
    }
  }

}
