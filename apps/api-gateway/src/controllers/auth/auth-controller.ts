import { Body, Controller, Get, Post, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler"; // Import Throttle decorator
import { AuthMicroserviceService } from "../../microservices/auth-microservice/auth-microservice.service";
import { API_PREFIX } from "@app/libs";
import { AuthCredsDto } from "@app/libs/dto/auth/auth-creds.dto";
import { AllExceptionsFilter } from "../../interceptors/exception-filter";
import { TransformResponseInterceptor } from "../../interceptors/transform-response.interceptor";


@Controller(`${API_PREFIX.V1}/auth`)
@UseFilters(AllExceptionsFilter) // ✅ Apply exception filter to this controller
export class AuthController {
    constructor(private authMicroserviceService: AuthMicroserviceService) {
    }
    
    // Apply specific rate limit: 5 requests per 60 seconds
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post()
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method
    async getAuth(@Body() body: AuthCredsDto): Promise<any> {
        return await this.authMicroserviceService.authenticateUser(body);
    }

    @Post('refresh')
    async refresh(@Body() body: { refresh_token: string }) {
      const { refresh_token } = body;
      // Call the Auth microservice to refresh
      return await this.authMicroserviceService.refreshToken(refresh_token);
    }
}