import { Body, Controller, Get, Param, Post, Query, UseFilters, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { MembersMicroserviceService } from "../../microservices/members-microservice/members-microservice.service";
import { JwtAuthGuard } from "../../guards/guards/jwt-auth.guard";
import { API_PREFIX, MemberCreationDto, ValidationPipe } from "@app/libs";
import { TransformResponseInterceptor } from "../../interceptors/transform-response.interceptor";
import { AuthUser } from "../../decorators/auth-user.decorator";
import { AuthService } from "../../service/auth.service";
import { MembersService } from "../../service/member.service";
import { AllExceptionsFilter } from "../../interceptors/exception-filter";


@Controller(`${API_PREFIX.V1}/members`)
@UseFilters(AllExceptionsFilter) // ✅ Apply exception filter to this controller
export class MembersController {
    constructor(private membersService: MembersService,
                private authService: AuthService
    ) {
    }


    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method for the body
    async createMember(@AuthUser() loggedInUser: any,
                       @Body() body: MemberCreationDto) {
        // const currentUser = await this.authService.getSelfInformation(loggedInUser.userId);
        try {
            return await this.membersService.createMember(body);
        } catch(error: any) {
            throw error
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method
    async getMembers(@AuthUser() loggedInUser: any,
                      @Query() queryParams: any ) {
        const currentUser = await this.authService.getSelfInformation(loggedInUser.userId);
        try {
            return this.membersService.getMembers(queryParams);
        } catch(error: any) {
            throw error
        }
    }

    
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method
    async getMember(@Param('id') id: string) {
        // const currentUser = await this.authService.getSelfInformation(loggedInUser.userId);
        try {
            return await this.membersService.getMember(id);
        } catch(error: any) {
            throw error
        }
    }
}