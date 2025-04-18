import { Injectable } from "@nestjs/common";
import { ChurchMicroserviceService } from "../microservices/church-microservice/church-microservice.service";
import { MembersMicroserviceService } from "../microservices/members-microservice/members-microservice.service";
import { ChurchCampusCreationDto } from "@app/libs";

@Injectable()
export class ChurchService {

    constructor( private readonly churchMicroserviceService: ChurchMicroserviceService,
                 private readonly membersMicroserviceService: MembersMicroserviceService) {}
    
    async getChurches(page: number, limit: number) {
        return await this.churchMicroserviceService.getChurches(page, limit);
    }

    async createChurchCampus(churchCampusCreationDto: ChurchCampusCreationDto) {
        const churchCampus = await this.churchMicroserviceService.createChurchCampus(churchCampusCreationDto);
        const referenceId = churchCampus.reference_id;
        const memberCreate = await this.membersMicroserviceService.createChurchCampusClosure(referenceId);
        console.log("memberCreate", memberCreate);
        return churchCampus;
    }
}