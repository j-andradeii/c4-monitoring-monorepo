import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'; 


@Injectable()
export class AuthService {

  constructor(private readonly jwtService: JwtService) {}


  getHello(): string {
    return 'Hello World!';
  }

  // Mock function: In real scenario, you'd query user from a DB
  private async validateUser(email: string, pass: string) {

    const salt = await bcrypt.genSalt(10);  
    // Retrieve user from DB
    const user = { id: 1, email: 'test@example.com', password: await bcrypt.hash('password', salt) };

    // Compare password
    if (user && (await bcrypt.compare(pass, user.password))) {
      return { id: user.id, email: user.email };
    }
    return null;
  }

    // Example user fetch: adapt to your DB/ORM
    private async getUserById(userId: number) {
      // In reality, fetch from DB. Hard-coding for example:
      return { id: userId, email: 'test@example.com' };
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

  async refresh(refreshToken: string) {
    try {
      // Verify refresh token with a dedicated secret (recommended)
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET',
      });
      // payload might have { sub: userId, email, iat, exp }

      // Optionally check if the refresh token is revoked or blacklisted in DB:
      // if (await this.isRefreshTokenRevoked(refreshToken)) {
      //   throw new UnauthorizedException('Refresh token revoked');
      // }

      // Retrieve the user from database
      const user = await this.getUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate a new access token & refresh token
      const newAccessToken = this.jwtService.sign(
        { sub: user.id, email: user.email }
      );
      const newRefreshToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET',
          expiresIn: '7d',
        },
      );

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
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
