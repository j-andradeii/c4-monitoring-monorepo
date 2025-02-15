import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import {  AUTH_COMMAND } from '@app/libs';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: AUTH_COMMAND.AUTHENTICATE })
  async authenticate(data: { email: string; password: string }) {
    console.log("AuthController", data);
    return this.authService.login(data.email, data.password);
  }

  @MessagePattern({ cmd: AUTH_COMMAND.VALIDATE_TOKEN })
  async validateToken(token: string) {
    return this.authService.validateToken(token);
  }


}
