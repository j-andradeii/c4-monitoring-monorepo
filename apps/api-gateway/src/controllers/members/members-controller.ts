import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { MembersMicroserviceService } from "../../microservices/members-microservice/members-microservice.service";
import { JwtAuthGuard } from "../../guards/guards/jwt-auth.guard";
import { API_PREFIX, MemberCreationDto, ValidationPipe } from "@app/libs";
import { TransformResponseInterceptor } from "../../interceptors/transform-response.interceptor";
import { AuthUser } from "../../decorators/auth-user.decorator";
import { AuthService } from "../../service/auth.service";


@Controller(`${API_PREFIX.V1}/members`)
export class MembersController {
    constructor(private membersMicroserviceService: MembersMicroserviceService,
                private authService: AuthService ) {
    }

    
    @Get()
    @UseGuards(JwtAuthGuard)
    async getMembers(): Promise<any> {
        const user = await this.membersMicroserviceService.authenticateUser();
        return user;
    }


    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    async createMember(@AuthUser() loggedInUser: any,
                       @Body() body: MemberCreationDto) {
        // const currentUser = await this.authService.getSelfInformation(loggedInUser.userId);
        console.log(body);
   
        return null;
    }
}