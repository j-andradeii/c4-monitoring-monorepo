
import { AUTH_COMMAND } from '@app/libs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthMicroserviceService {

    constructor( @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy   ) {}
 
    async authenticateUser() {
       const user = this.authClient.send(
            { cmd: AUTH_COMMAND.AUTHENTICATE },  // This command must match the @MessagePattern in the Auth Microservice
            { email: 'test@example.com', password: 'password' }  // This is the payload sent to the microservice
        );
        return await lastValueFrom(user);
    }
}