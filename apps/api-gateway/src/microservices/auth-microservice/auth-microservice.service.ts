
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthMicroserviceService {

    constructor( @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy   ) {}
 
    async authenticateUser() {
        
        return this.authClient.send(
            { cmd: 'authenticate' },  // This command must match the @MessagePattern in the Auth Microservice
            { username: 'test', password: 'testa' }  // This is the payload sent to the microservice
        );
    }
}