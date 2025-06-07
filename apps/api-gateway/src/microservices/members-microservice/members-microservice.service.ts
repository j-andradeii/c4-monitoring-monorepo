
import { MEMBER_COMMAND, MemberDto } from '@app/libs';
import { ChurchCampusStaffCreationDto } from '@app/libs/dto/church/church-campus-staff-creation.dto';
import { MemberCreationDto } from '@app/libs/dto/member/member.creation.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MembersMicroserviceService {

    constructor( @Inject('MEMBERS_SERVICE') private readonly membersClient: ClientProxy   ) {}
 
    async authenticateUser() {
        return await this.membersClient.send(
            { cmd: 'members_authenticate' },  // This command must match the @MessagePattern in the Auth Microservice
            { username: 'test', password: 'testa' }  // This is the payload sent to the microservice
        );
    }

    async getMemberByAuthId(auth_id: string) {
        try{
            const memberResponse = await this.membersClient.send(
                { cmd: MEMBER_COMMAND.GET_MEMBER_BY_AUTH_ID },  // This command must match the @MessagePattern in the Auth Microservice
                {auth_id}  // This is the payload sent to the microservice
            );
            return await lastValueFrom(memberResponse);
        } catch(error) {
            throw error;
        }
    }

    async getMembers(queryParams: any) {
        try{
            const memberResponse = await this.membersClient.send(
                { cmd: MEMBER_COMMAND.GET_MEMBERS },  // This command must match the @MessagePattern in the Auth Microservice
                queryParams  // This is the payload sent to the microservice
            );
            return await lastValueFrom(memberResponse);
        } catch(error) {
            throw error;
        }
    }

    async getManyMembersByIds(member_ids: string[]) {
        try{
            const memberResponse = await this.membersClient.send(
                { cmd: MEMBER_COMMAND.GET_MEMBERS_BY_IDS },  // This command must match the @MessagePattern in the Auth Microservice
                member_ids  // This is the payload sent to the microservice
            );
            return await lastValueFrom(memberResponse);
        } catch(error) {
            throw error;
        }
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


    async createMember( memberCreationDto: MemberCreationDto): Promise<MemberDto> {
        try{
            const memberResponse = await this.membersClient.send(
                { cmd: MEMBER_COMMAND.CREATE_MEMBER },  // This command must match the @MessagePattern in the Auth Microservice
                memberCreationDto // This is the payload sent to the microservice
            );
            return await lastValueFrom(memberResponse);
        } catch(error) {
            throw error;
        }
    }

   

    async fallbackCreateMember(member_id: string) {
        try{
            const memberResponse = await this.membersClient.send(
                { cmd: MEMBER_COMMAND.FALLBACK_CREATE_MEMBER },  // This command must match the @MessagePattern in the Auth Microservice
                member_id  // This is the payload sent to the microservice
            );
            return await lastValueFrom(memberResponse);
        } catch(error) {
            throw error;
        }
    }   
}