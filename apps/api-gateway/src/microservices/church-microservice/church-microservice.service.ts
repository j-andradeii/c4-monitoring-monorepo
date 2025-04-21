
import { CHURCH_COMMAND, ChurchCampusCreationDto } from '@app/libs';
import { ChurchCampusStaffCreationDto } from '@app/libs/dto/church/church-campus-staff-creation.dto';
import { ChurchCampusDto } from '@app/libs/dto/church/church-campus.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

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
        try{
            const churchCampusResponse = this.churchClient.send(
                { cmd: CHURCH_COMMAND.CREATE_CHURCH_CAMPUS},  // This command must match the @MessagePattern in the Auth Microservice
                churchCampusCreationDto  // This is the payload sent to the microservice
            );
            return await lastValueFrom(churchCampusResponse);
        } catch(error) {
            throw error;
        }
    }

    async createChurchCampusStaff(campus_id:string, member_id: string, churchCampusStaffCreationDto: ChurchCampusStaffCreationDto) {
        try{
            const churchCampusStaffResponse = this.churchClient.send(
                { cmd: CHURCH_COMMAND.CREATE_CHURCH_CAMPUS_STAFF},  // This command must match the @MessagePattern in the Auth Microservice
                {
                    campus_id,
                    member_id,
                    churchCampusStaffCreationDto,
                }  // This is the payload sent to the microservice
            );
            return await lastValueFrom(churchCampusStaffResponse);
        } catch(error) {
            throw error;
        }
    }

    async getChurchCampusById(id: string): Promise<ChurchCampusDto> {
        try{
            const churchCampusResponse = this.churchClient.send(
                {cmd: CHURCH_COMMAND.GET_CHURCH_CAMPUS_BY_ID},  // This command must match the @MessagePattern in the Auth Microservice
                id
            );
            return await lastValueFrom(churchCampusResponse);
        } catch(error) {
            throw error;
        }
    }


    async getChurches(page: number, limit: number) {
        return await this.churchClient.send(
            { cmd: CHURCH_COMMAND.GET_CHURCHES},  // This command must match the @MessagePattern in the Auth Microservice
            { page, limit }  // This is the payload sent to the microservice
        );
    }

    async healthCheck() {
        const staffResponse = await this.churchClient.send(
            { cmd: CHURCH_COMMAND.HEALTH_CHECK},  // This command must match the @MessagePattern in the Auth Microservice
            {}
        );
        return await lastValueFrom(staffResponse);
    }

    async getChurchCampusStaffs(church_campus_id: string, page: number, limit: number): Promise<any> {
        const staffResponse = await this.churchClient.send(
            { cmd: CHURCH_COMMAND.GET_CHURCH_CAMPUS_STAFFS},  // This command must match the @MessagePattern in the Auth Microservice
            { church_campus_id, page, limit }  // This is the payload sent to the microservice
        );
        return await lastValueFrom(staffResponse);
    }
}