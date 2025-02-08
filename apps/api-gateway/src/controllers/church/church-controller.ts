import { Controller, Get } from "@nestjs/common";
import { AuthMicroserviceService } from "../../microservices/auth-microservice/auth-microservice.service";
import { ChurchMicroserviceService } from "../../microservices/church-microservice/church-microservice.service";


@Controller("church")
export class ChurchController {
    constructor(private churchMicroserviceService: ChurchMicroserviceService) {
    }

    @Get()
    async getAuth(): Promise<any> {
        const user = await this.churchMicroserviceService.authenticateUser();
        return user;
    }
}