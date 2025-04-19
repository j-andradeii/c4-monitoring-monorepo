import { Body, Controller, Get, Param, Post, UseFilters, UseGuards, UseInterceptors, UsePipes, ParseUUIDPipe } from "@nestjs/common"; // Import ParseUUIDPipe
import { AllExceptionsFilter } from "../../interceptors/exception-filter";
import { API_PREFIX, ChurchCampusCreationDto, ValidationPipe } from "@app/libs";
import { JwtAuthGuard } from "../../guards/guards/jwt-auth.guard";
import { TransformResponseInterceptor } from "../../interceptors/transform-response.interceptor";
import { ChurchService } from "../../service/church-service";
import { ChurchCampusStaffCreationDto } from "@app/libs/dto/church/church-campus-staff-creation.dto";

@Controller(`${API_PREFIX.V1}/churchCampuses`)
@UseFilters(AllExceptionsFilter) // ✅ Apply exception filter to this controller
export class ChurchCampusController {
    constructor(private churchService: ChurchService) {
    }


    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method
    async getChurchCampus(@Param('id') id: string): Promise<any> {
        try {
            return await this.churchService.getChurchCampusById(id);
        //    return this.churchService.createChurchCampus(body);
        } catch(error: any) {
            throw error
        }
    }



    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method
    async createChurchCampus(@Body() body: ChurchCampusCreationDto): Promise<any> {
        try {
           return await this.churchService.createChurchCampus(body);
        } catch(error: any) {
            throw error
        }
    }

    @Post(':id/churchCampusStaff') // Changed route to include staff segment
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method for the body
    async createChurchCampusStaff(
        @Param('id') campus_id: string, // Extract 'id' param and validate as UUID
        @Body() body: ChurchCampusStaffCreationDto
    ): Promise<any> {
        try {
            return await this.churchService.createChurchCampusStaff(campus_id, body)
        } catch(error: any) {
            throw error
        }
    }

}