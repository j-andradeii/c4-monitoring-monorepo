
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MembersMicroserviceService {

    constructor( @Inject('MEMBERS_SERVICE') private readonly membersClient: ClientProxy   ) {}
 
    async authenticateUser() {
        
        return this.membersClient.send(
            { cmd: 'members_authenticate' },  // This command must match the @MessagePattern in the Auth Microservice
            { username: 'test', password: 'testa' }  // This is the payload sent to the microservice
        );
    }
}