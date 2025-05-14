import { Body, Controller, Get, Post, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler"; // Import Throttle decorator
import { AuthMicroserviceService } from "../../microservices/auth-microservice/auth-microservice.service";
import { API_PREFIX } from "@app/libs";
import { AuthCredsDto, AuthDto, SelfInformationDto } from "@app/libs/dto/auth/auth-creds.dto";
import { AllExceptionsFilter } from "../../interceptors/exception-filter";
import { TransformResponseInterceptor } from "../../interceptors/transform-response.interceptor";
import { JwtAuthGuard } from "../../guards/guards/jwt-auth.guard";
import { AuthUser } from "../../decorators/auth-user.decorator";
import { AuthService } from "../../service/auth.service";


@Controller(`${API_PREFIX.V1}/auth`)
@UseFilters(AllExceptionsFilter) // ✅ Apply exception filter to this controller
export class AuthController {
    constructor(private authMicroserviceService: AuthMicroserviceService,
                private authService: AuthService) {
    }
    
    // Apply specific rate limit: 5 requests per 60 seconds
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post()
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method
    async getAuth(@Body() body: AuthCredsDto): Promise<AuthDto> {
        return await this.authMicroserviceService.authenticateUser(body);
    }


    @Get('self')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method
    async getSelfInformation(@AuthUser() loggedInUser: any): Promise<SelfInformationDto> {
      console.log(loggedInUser);
      return await this.authService.getSelfInformation(loggedInUser.userId);
    }

    @Post('refresh')
    async refresh(@Body() body: { refresh_token: string }) {
      const { refresh_token } = body;
      // Call the Auth microservice to refresh
      return await this.authMicroserviceService.refreshToken(refresh_token);
    }
}