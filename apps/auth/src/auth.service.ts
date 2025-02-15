import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

  constructor(private readonly jwtService: JwtService) {}


  getHello(): string {
    return 'Hello World!';
  }

  // Mock function: In real scenario, you'd query user from a DB
  private async validateUser(email: string, pass: string) {
    // Retrieve user from DB
    const user = { id: 1, email: 'test@example.com', password: await bcrypt.hash('password', 10) };

    // Compare password
    if (user && (await bcrypt.compare(pass, user.password))) {
      return { id: user.id, email: user.email };
    }
    return null;
  }


  async login(email: string, pass: string) {
   
    const user = await this.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET', expiresIn: '7d' },
    );
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET
      });
      return payload;
    } catch (err) {
      return null;
    }
  }
}
