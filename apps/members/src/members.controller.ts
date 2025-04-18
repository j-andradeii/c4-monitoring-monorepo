import { Controller, Get } from '@nestjs/common';
import { MembersService } from './members.service';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { CreateChurchCampusMemberClosureCommand } from './cqrs/commands/create-church-campus-member-closure.command';
@Controller()
export class MembersController {
  constructor(private readonly membersService: MembersService,
              private readonly commandBus: CommandBus) {}

  @MessagePattern({ cmd: 'members_authenticate' })
  async authenticate(data: any): Promise<any> {
    console.log("recieved-MembersControllermembers controller1", data);
    return {
      name: "Joseph andrade 10 members-microservice"
    };
  }

  @MessagePattern({ cmd: 'create_church_campus_closure' })
  async createChurchCampusClosure(data: any): Promise<any> {
    return await this.commandBus.execute(new CreateChurchCampusMemberClosureCommand(data.referenceId));
  }

}
