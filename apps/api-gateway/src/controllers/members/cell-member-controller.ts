import { API_PREFIX, MemberCreationDto } from "@app/libs";
import { Body, Controller, Post, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "../../interceptors/exception-filter";
import { MembersService } from "../../service/member.service";
import { AuthService } from "../../service/auth.service";
import { JwtAuthGuard } from "../../guards/guards/jwt-auth.guard";
import { TransformResponseInterceptor } from "../../interceptors/transform-response.interceptor";
import { AuthUser } from "../../decorators/auth-user.decorator";


@Controller(`${API_PREFIX.V1}/cellMembers`)
@UseFilters(AllExceptionsFilter) // ✅ Apply exception filter to this controller
export class CellMembersController {
    constructor(private membersService: MembersService,
                private authService: AuthService ) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method for the body
    async createCellMember(@AuthUser() loggedInUser: any,
                       @Body() body: MemberCreationDto) {
        // const currentUser = await this.authService.getSelfInformation(loggedInUser.userId);
        try {
            return await this.membersService.createMember(body);
        } catch(error: any) {
            throw error
        }
    }

}