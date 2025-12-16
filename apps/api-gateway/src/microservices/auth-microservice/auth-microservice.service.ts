
import { AUTH_COMMAND } from '@app/libs';
import { AuthCredsDto, AuthDto } from '@app/libs/dto/auth/auth-creds.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ApiCryptoService } from '../../service/api-crypto-service';

@Injectable()
export class AuthMicroserviceService {

    constructor( @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
                private apiCryptoService: ApiCryptoService) {}
 
    async authenticateUser(body: AuthCredsDto): Promise<AuthDto> {
       const decryptedPassword =  this.apiCryptoService.decrypt(body.password);
       const user = this.authClient.send(
            { cmd: AUTH_COMMAND.AUTHENTICATE },  // This command must match the @MessagePattern in the Auth Microservice
            { email: body.email, password: decryptedPassword }  // This is the payload sent to the microservice
        );
        return await lastValueFrom(user);
    }

  

    async refreshToken(refresh_token: string) {
        const token = this.authClient.send(
            { cmd: AUTH_COMMAND.REFRESH_TOKEN },
            refresh_token
        );
        return await lastValueFrom(token);
    }
}