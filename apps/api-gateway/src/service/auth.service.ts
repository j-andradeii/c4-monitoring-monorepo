import { Injectable } from "@nestjs/common";
import { ChurchMicroserviceService } from "../microservices/church-microservice/church-microservice.service";
import { MembersMicroserviceService } from "../microservices/members-microservice/members-microservice.service";
import { AuthMicroserviceService } from "../microservices/auth-microservice/auth-microservice.service";

@Injectable()
export class AuthService {

    constructor( private readonly churchMicroserviceService: ChurchMicroserviceService,
                 private readonly membersMicroserviceService: MembersMicroserviceService,
                 private readonly authMicroserviceService: AuthMicroserviceService) {
    }



    async getSelfInformation(auth_id: string) {
        const churchCampusMember = await this.membersMicroserviceService.getMemberByAuthId(auth_id);
        console.log(churchCampusMember);
        return churchCampusMember;
    }

}