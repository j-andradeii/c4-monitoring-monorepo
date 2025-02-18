import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors, UsePipes, UseFilters } from "@nestjs/common";
import { ChurchMicroserviceService } from "../../microservices/church-microservice/church-microservice.service";
import { JwtAuthGuard } from "../../guards/guards/jwt-auth.guard";
import { TransformResponseInterceptor } from "../../interceptors/transform-response.interceptor";
import { API_PREFIX, ChurchCampusCreationDto, ValidationPipe } from "@app/libs";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { AllExceptionsFilter } from "../../interceptors/exception-filter";

@Controller(`${API_PREFIX.V1}/churches`)
@UseFilters(AllExceptionsFilter) // ✅ Apply exception filter to this controller
export class ChurchController {
    constructor(private churchMicroserviceService: ChurchMicroserviceService) {
    }

 

    @Get()
    // @UseGuards(OptionalJwtAuthGuard) // ✅ Optional guard
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    async getAuth(@Req() req: any): Promise<any> {
        return await this.churchMicroserviceService.authenticateUser();
    }
}


// const _user = req.user || null; // If no token, user is null
// const response = _user
//   ? { message: 'Authenticated User', user: _user }
//   : { message: 'Guest User' };
// console.log(response);
// // const user = await this.churchMicroserviceService.authenticateUser();
// return response;