
import { MEMBER_COMMAND } from '@app/libs';
import { ChurchCampusStaffCreationDto } from '@app/libs/dto/church/church-campus-staff-creation.dto';
import { MemberCreationDto } from '@app/libs/dto/member/member.creation.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MembersMicroserviceService {

    constructor( @Inject('MEMBERS_SERVICE') private readonly membersClient: ClientProxy   ) {}
 
    async authenticateUser() {
        console.log("membersClient", this.membersClient);
        return await this.membersClient.send(
            { cmd: 'members_authenticate' },  // This command must match the @MessagePattern in the Auth Microservice
            { username: 'test', password: 'testa' }  // This is the payload sent to the microservice
        );
    }

    async createChurchCampusClosure(referenceId: string) {
        try{
            const memberResponse = await this.membersClient.send(
                { cmd: 'create_church_campus_closure' },  // This command must match the @MessagePattern in the Auth Microservice
                { referenceId: referenceId }  // This is the payload sent to the microservice
            );
            return await lastValueFrom(memberResponse);
        } catch(error) {
            throw error;
        }
    }   


    async createMember(churchCampus:any, memberCreationDto: MemberCreationDto) {
        try{
           memberCreationDto = {
                ...memberCreationDto,
                church_campus_id: churchCampus.id,
                church_id: churchCampus.church.id
            };
            const memberResponse = await this.membersClient.send(
                { cmd: MEMBER_COMMAND.CREATE_MEMBER },  // This command must match the @MessagePattern in the Auth Microservice
                memberCreationDto // This is the payload sent to the microservice
            );
            return await lastValueFrom(memberResponse);
        } catch(error) {
            throw error;
        }
    }

   
}