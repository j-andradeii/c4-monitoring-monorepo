import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthMicroserviceService } from "../../microservices/auth-microservice/auth-microservice.service";
import { ChurchMicroserviceService } from "../../microservices/church-microservice/church-microservice.service";
import { JwtAuthGuard } from "../../guards/guards/jwt-auth.guard";
import { TransformResponseInterceptor } from "../../interceptors/transform-response.interceptor";
import { OptionalJwtAuthGuard } from "../../guards/guards/jwt-auth-optional.guard";

@Controller("church")
export class ChurchController {
    constructor(private churchMicroserviceService: ChurchMicroserviceService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    async createChurch(@Body() body: any): Promise<any> {
        console.log(body);
        return "";
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