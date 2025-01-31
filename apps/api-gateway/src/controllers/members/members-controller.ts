import { Controller, Get } from "@nestjs/common";
import { MembersMicroserviceService } from "../../microservices/members-microservice/members-microservice.service";


@Controller("members")
export class MembersController {
    constructor(private membersMicroserviceService: MembersMicroserviceService) {
    }

    @Get()
    async getAuth(): Promise<any> {
        console.log("members controller");
        const user = await this.membersMicroserviceService.authenticateUser();
        return user;
    }
}