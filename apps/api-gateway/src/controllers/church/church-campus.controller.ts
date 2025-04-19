import { Body, Controller, Get, Param, Post, UseFilters, UseGuards, UseInterceptors, UsePipes, ParseUUIDPipe, Query } from "@nestjs/common"; // Import ParseUUIDPipe
import { AllExceptionsFilter } from "../../interceptors/exception-filter";
import { API_PREFIX, ChurchCampusCreationDto, ValidationPipe } from "@app/libs";
import { JwtAuthGuard } from "../../guards/guards/jwt-auth.guard";
import { TransformResponseInterceptor } from "../../interceptors/transform-response.interceptor";
import { ChurchService } from "../../service/church-service";
import { ChurchCampusStaffCreationDto } from "@app/libs/dto/church/church-campus-staff-creation.dto";
import { ChurchCampusDto } from "@app/libs/dto/church/church-campus.dto";

@Controller(`${API_PREFIX.V1}/churchCampuses`)
@UseFilters(AllExceptionsFilter) // ✅ Apply exception filter to this controller
export class ChurchCampusController {
    constructor(private churchService: ChurchService) {
    }


    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<ChurchCampusDto>)
    @UsePipes(ValidationPipe) // Use the pipe on this method
    async getChurchCampus(@Param('id') id: string): Promise<any> {
        try {
            return await this.churchService.getChurchCampusById(id);
        //    return this.churchService.createChurchCampus(body);
        } catch(error: any) {
            throw error
        }
    }

    @Get(':id/churchCampusStaffs')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<ChurchCampusDto>)
    @UsePipes(ValidationPipe) // Use the pipe on this method
    async getChurchCampusStaffs(@Param('id') id: string,
                                @Query('page') page = 1, 
                                @Query('limit') limit = 10) {
        try {
            return await this.churchService.getChurchCampusStaffs(id, page, limit);
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

    @Post(':id/churchCampusStaffs') // Changed route to include staff segment
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

    @Post(':id/churchCampusStaffs/:campus_staff_id') 
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method for the body
    async insertToClosureCampusStaff(@Param('id') campus_id: string,
                                     @Param('campus_staff_id') campus_staff_id: string,) {
        try {
            return campus_staff_id;//
        } catch(error: any) {
            throw error
        }
    }

}