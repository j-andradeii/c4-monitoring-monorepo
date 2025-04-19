import { Injectable } from "@nestjs/common";
import { ChurchMicroserviceService } from "../microservices/church-microservice/church-microservice.service";
import { MembersMicroserviceService } from "../microservices/members-microservice/members-microservice.service";
import { ChurchCampusCreationDto } from "@app/libs";
import { ChurchCampusStaffCreationDto } from "@app/libs/dto/church/church-campus-staff-creation.dto";
import { Member } from "apps/members/src/entities/member.entity";
import { ChurchCampusStaff } from "apps/church/src/entities/church-campus-staff.entity";

@Injectable()
export class ChurchService {

    constructor( private readonly churchMicroserviceService: ChurchMicroserviceService,
                 private readonly membersMicroserviceService: MembersMicroserviceService) {}
    

    async getChurchCampusById(id: string) {
        return await this.churchMicroserviceService.getChurchCampusById(id);
    }

    async getChurches(page: number, limit: number) {
        return await this.churchMicroserviceService.getChurches(page, limit);
    }

    async createChurchCampus(churchCampusCreationDto: ChurchCampusCreationDto) {
        const churchCampus = await this.churchMicroserviceService.createChurchCampus(churchCampusCreationDto);
        const referenceId = churchCampus.reference_id;
        const memberCreate = await this.membersMicroserviceService.createChurchCampusClosure(referenceId);
        return churchCampus;
    }

    async createChurchCampusStaff(campus_id:string, churchCampusStaffCreationDto: ChurchCampusStaffCreationDto) {

        let member = null;
        let churchCampusStaff = null;
        try {
            const churchCampus =  await this.churchMicroserviceService.getChurchCampusById(campus_id);
            member = await this.membersMicroserviceService.createMember(churchCampus, churchCampusStaffCreationDto.member);
            const member_id = member.id;
            churchCampusStaff = await this.churchMicroserviceService.createChurchCampusStaff(campus_id, member_id, churchCampusStaffCreationDto);
            return {
                member,
                churchCampusStaff
            };
        } catch(error) {
            if(member) {
                await this.membersMicroserviceService.fallbackCreateMember(member.id)
            }

            throw error;
        }
    }

 
}