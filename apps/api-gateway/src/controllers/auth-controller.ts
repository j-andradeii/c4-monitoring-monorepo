import { Controller, Get } from "@nestjs/common";
import { AuthMicroserviceService } from "../microservices/auth-microservice/auth-microservice.service";


@Controller("auth")
export class AuthController {
    constructor(private authMicroserviceService: AuthMicroserviceService) {
    }

    @Get()
    async getAuth(): Promise<any> {
        const user = await this.authMicroserviceService.authenticateUser();
        return user;
    }
}