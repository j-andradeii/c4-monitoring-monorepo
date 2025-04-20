import { Controller, Get, UseGuards } from "@nestjs/common";
import { MembersMicroserviceService } from "../../microservices/members-microservice/members-microservice.service";
import { JwtAuthGuard } from "../../guards/guards/jwt-auth.guard";


@Controller("members")
export class MembersController {
    constructor(private membersMicroserviceService: MembersMicroserviceService) {
    }

    
    @Get()
    @UseGuards(JwtAuthGuard)
    async getMembers(): Promise<any> {
        const user = await this.membersMicroserviceService.authenticateUser();
        return user;
    }
}