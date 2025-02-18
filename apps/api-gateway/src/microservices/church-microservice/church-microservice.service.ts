
import { CHURCH_COMMAND, ChurchCampusCreationDto } from '@app/libs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ChurchMicroserviceService {

    constructor(@Inject('CHURCH_SERVICE') private readonly churchClient: ClientProxy   ) {}
 
    async authenticateUser() {
        return this.churchClient.send(
            { cmd: CHURCH_COMMAND.CREATE_CHURCH},  // This command must match the @MessagePattern in the Auth Microservice
            { username: 'testb', password: 'testb' }  // This is the payload sent to the microservice
        );
    }

    async createChurchCampus(churchCampusCreationDto: ChurchCampusCreationDto) {
        return this.churchClient.send(
            { cmd: CHURCH_COMMAND.CREATE_CHURCH_CAMPUS},  // This command must match the @MessagePattern in the Auth Microservice
            churchCampusCreationDto  // This is the payload sent to the microservice
        );
    }


    async getChurches(page: number, limit: number) {
        return await this.churchClient.send(
            { cmd: CHURCH_COMMAND.GET_CHURCHES},  // This command must match the @MessagePattern in the Auth Microservice
            { page, limit }  // This is the payload sent to the microservice
        );
    }
}