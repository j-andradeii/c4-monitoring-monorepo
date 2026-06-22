import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Custom extractor: check cookie first, then Bearer header
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. Try to extract from cookie first (web clients)
        (request: Request) => {
          return request?.cookies?.ACCESS_TOKEN || null;
        },
        // 2. Fall back to Bearer token header (mobile/API clients)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
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
