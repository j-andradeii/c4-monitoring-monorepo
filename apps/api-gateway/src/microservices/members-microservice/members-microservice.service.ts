
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
}