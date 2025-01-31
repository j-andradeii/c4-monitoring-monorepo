import { Controller, Get } from '@nestjs/common';
import { MembersService } from './members.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @MessagePattern({ cmd: 'members_authenticate' })
  async authenticate(data: any): Promise<any> {
    console.log("recieved-MembersControllermembers controller");
    return {
      name: "Joseph andrade 10 members-microservice"
    };
  }


}
