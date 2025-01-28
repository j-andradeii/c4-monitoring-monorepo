
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ChurchMicroserviceService {

    constructor( @Inject('CHURCH_SERVICE') private readonly churchClient: ClientProxy   ) {}
 
    async authenticateUser() {
        
        return this.churchClient.send(
            { cmd: 'church_authenticate' },  // This command must match the @MessagePattern in the Auth Microservice
            { username: 'test', password: 'testa' }  // This is the payload sent to the microservice
        );
    }
}