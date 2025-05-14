import { Injectable } from "@nestjs/common";
import { ChurchMicroserviceService } from "../microservices/church-microservice/church-microservice.service";
import { MembersMicroserviceService } from "../microservices/members-microservice/members-microservice.service";
import { AuthMicroserviceService } from "../microservices/auth-microservice/auth-microservice.service";
import { SelfInformationDto } from "@app/libs";

@Injectable()
export class AuthService {

    constructor( private readonly churchMicroserviceService: ChurchMicroserviceService,
                 private readonly membersMicroserviceService: MembersMicroserviceService,
                 private readonly authMicroserviceService: AuthMicroserviceService) {
    }



    async getSelfInformation(auth_id: string): Promise<SelfInformationDto> {
        const churchCampusMember = await this.membersMicroserviceService.getMemberByAuthId(auth_id);
        const churchCampusStaff = await this.churchMicroserviceService.getChurchStaffByMemberId(churchCampusMember.member.id);
        return  {
            member: churchCampusMember.member,
            church_campus_staff: churchCampusStaff
        };
    }

}