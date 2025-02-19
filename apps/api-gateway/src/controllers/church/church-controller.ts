import { Body, Controller, Get, Req, UseGuards, UseInterceptors, UsePipes, UseFilters, Query } from "@nestjs/common";
import { JwtAuthGuard } from "../../guards/guards/jwt-auth.guard";
import { TransformResponseInterceptor } from "../../interceptors/transform-response.interceptor";
import { API_PREFIX} from "@app/libs";
import { AllExceptionsFilter } from "../../interceptors/exception-filter";
import { ChurchService } from "../../service/church-service";

@Controller(`${API_PREFIX.V1}/churches`)
@UseFilters(AllExceptionsFilter) // ✅ Apply exception filter to this controller
export class ChurchController {
    constructor(private churchService: ChurchService) {
    }

 

    // @Get()
    // // @UseGuards(OptionalJwtAuthGuard) // ✅ Optional guard
    // @UseGuards(JwtAuthGuard)
    // @UseInterceptors(TransformResponseInterceptor<any>)
    // async getAuth(@Req() req: any): Promise<any> {
    //     return await this.churchMicroserviceService.authenticateUser();
    // }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    async getChurches(
        @Query('page') page = 1,   // Default page is 1 if not provided
        @Query('limit') limit = 10 // Default limit is 10 if not provided
    ): Promise<any> {
        return await this.churchService.getChurches(page, limit);
    }
}


// const _user = req.user || null; // If no token, user is null
// const response = _user
//   ? { message: 'Authenticated User', user: _user }
//   : { message: 'Guest User' };
// console.log(response);
// // const user = await this.churchMicroserviceService.authenticateUser();
// return response;