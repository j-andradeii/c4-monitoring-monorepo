import { Injectable } from "@nestjs/common";
import { ChurchMicroserviceService } from "../microservices/church-microservice/church-microservice.service";
import { MembersMicroserviceService } from "../microservices/members-microservice/members-microservice.service";
import { MemberCreationDto } from "@app/libs";

@Injectable()
export class MembersService {

    constructor( private readonly churchMicroserviceService: ChurchMicroserviceService,
                 private readonly membersMicroserviceService: MembersMicroserviceService) {}




    async createMember(memberCreationDto: MemberCreationDto): Promise<any> {
        try {
           const member = await this.membersMicroserviceService.createMember(memberCreationDto);
           return member;
        } catch(error) {
            throw error;
        }
    }


    async createCellMember(memberCreationDto: MemberCreationDto): Promise<any> {
        try {
           const churchCampus = await this.churchMicroserviceService.getChurchCampusById(memberCreationDto.church_campus_id);
           const member = await this.membersMicroserviceService.createCellMember(memberCreationDto, churchCampus);
           return member;
        } catch(error) {
            throw error;
        }
    }

    async getMembers(queryParams: any): Promise<any> {
        try {
           const member = await this.membersMicroserviceService.getMembers(queryParams);
           return member;
        } catch(error) {
            throw error;
        }
    }

    async getMember(id: string): Promise<any> {

    }

    

}