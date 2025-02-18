// access-token.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import { ApiCryptoService } from '../api-crypto-service';
@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {

  constructor(private readonly apiCryptoService: ApiCryptoService){

  }

  use(req: Request, res: Response, next: NextFunction) {
    // Retrieve the X-ACCESS-TOKEN header (case-insensitive)
    const token = req.header('X-ACCESS-TOKEN');
    const tokenTime = req.header('X-ACCESS');

    const decryptedToken = this.apiCryptoService.decrypt(token);
    const decryptedTokenTime = this.apiCryptoService.decrypt(tokenTime);

    // If the token is missing or invalid, you can stop the request here
    if (!token || !tokenTime) {
      return res.status(403).json({ message: 'Access token missing' });
    }

    const currentTime = new Date().getTime();
    const isWithinInFiveMinutes = (currentTime - Number(decryptedTokenTime)) <= Number(process.env.X_ACCESS_TOKEN_VALIDITY);
 

    if((process.env.X_ACCESS_TOKEN_KEY !== decryptedToken)|| !isWithinInFiveMinutes){ 
      return res.status(403).json({ message: 'Access token invalid' });
    }




    // If needed, verify or validate the token here
    // e.g., decode it, check against a database, etc.

    // If everything is okay, proceed
    next();
  }
}
