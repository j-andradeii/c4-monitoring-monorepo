import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Where to pull the JWT token from
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Whether to ignore token expiration errors
      ignoreExpiration: false,
      // Must match the 'secret' or public key used in Auth microservice
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * This method runs after Passport verifies the token signature.
   * The `payload` is the decoded token content (e.g., { sub: userId, email, iat, exp })
   */
  async validate(payload: any) {
    // You can attach extra user info, or do a DB lookup here if needed.
    // The return value is what will be attached to `req.user`
    return { userId: payload.sub, email: payload.email };
  }
}
