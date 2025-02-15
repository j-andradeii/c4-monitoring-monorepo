import { Controller, Get, Post } from "@nestjs/common";
import { AuthMicroserviceService } from "../../microservices/auth-microservice/auth-microservice.service";
import { API_PREFIX } from "@app/libs";


@Controller(`${API_PREFIX.V1}/auth`)
export class AuthController {
    constructor(private authMicroserviceService: AuthMicroserviceService) {
    }
    
    @Post()
    async getAuth(): Promise<any> {
        return await this.authMicroserviceService.authenticateUser();
    }
}