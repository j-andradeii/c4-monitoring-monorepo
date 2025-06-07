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

}