import { Body, Controller, Get, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler"; // Import Throttle decorator
import { AuthMicroserviceService } from "../../microservices/auth-microservice/auth-microservice.service";
import { API_PREFIX } from "@app/libs";


@Controller(`${API_PREFIX.V1}/auth`)
export class AuthController {
    constructor(private authMicroserviceService: AuthMicroserviceService) {
    }
    
    // Apply specific rate limit: 5 requests per 60 seconds
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post()
    async getAuth(): Promise<any> {
        return await this.authMicroserviceService.authenticateUser();
    }

    @Post('refresh')
    async refresh(@Body() body: { refresh_token: string }) {
      const { refresh_token } = body;
      // Call the Auth microservice to refresh
      return await this.authMicroserviceService.refreshToken(refresh_token);
    }
}