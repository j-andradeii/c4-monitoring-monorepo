import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'authenticate' })
  async authenticate(data: any): Promise<any> {
    return {
      name: "Joseph andrade 10"
    };
  }
}
