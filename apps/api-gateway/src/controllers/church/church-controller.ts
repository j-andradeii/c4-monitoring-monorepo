import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthMicroserviceService } from "../../microservices/auth-microservice/auth-microservice.service";
import { ChurchMicroserviceService } from "../../microservices/church-microservice/church-microservice.service";
import { JwtAuthGuard } from "../../guards/guards/jwt-auth.guard";


@Controller("church")
export class ChurchController {
    constructor(private churchMicroserviceService: ChurchMicroserviceService) {
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAuth(): Promise<any> {
        const user = await this.churchMicroserviceService.authenticateUser();
        return user;
    }
}