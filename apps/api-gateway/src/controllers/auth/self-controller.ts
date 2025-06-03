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


@Controller(`${API_PREFIX.V1}`)
@UseFilters(AllExceptionsFilter) // ✅ Apply exception filter to this controller
export class SelfController {
    constructor(private authMicroserviceService: AuthMicroserviceService,
                private authService: AuthService) {
    }
    
 

    @Get('self')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method
    async getSelfInformation(@AuthUser() loggedInUser: any): Promise<SelfInformationDto> {
      console.log(loggedInUser);
      return await this.authService.getSelfInformation(loggedInUser.userId);
    }

}