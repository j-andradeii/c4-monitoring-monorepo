import { Body, Controller, Post, UseFilters, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { AllExceptionsFilter } from "../../interceptors/exception-filter";
import { API_PREFIX, ChurchCampusCreationDto, ValidationPipe } from "@app/libs";
import { ChurchMicroserviceService } from "../../microservices/church-microservice/church-microservice.service";
import { JwtAuthGuard } from "../../guards/guards/jwt-auth.guard";
import { TransformResponseInterceptor } from "../../interceptors/transform-response.interceptor";

@Controller(`${API_PREFIX.V1}/churchCampuses`)
@UseFilters(AllExceptionsFilter) // ✅ Apply exception filter to this controller
export class ChurchCampusController {
    constructor(private churchMicroserviceService: ChurchMicroserviceService) {
    }


    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method
    async createChurchCampus(@Body() body: ChurchCampusCreationDto): Promise<any> {
        try {
           return this.churchMicroserviceService.createChurchCampus(body);
        } catch(error: any) {
            throw error
        }
    }

}