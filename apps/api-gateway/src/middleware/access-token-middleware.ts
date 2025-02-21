// access-token.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import { ApiCryptoService } from '../service/api-crypto-service';
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

    console.log("descrypted tokenTime", this.apiCryptoService.decrypt("e270dc7705a99695249fd67b68986879:233bbebad8742a9d2cd315bdc6dbb1b8"));
    console.log("decryptedToken", this.apiCryptoService.decrypt("da4d39a25bc05258997a38e2ab9a329c:106016cea42637681296dc2111afb4bbfaaf5a473848609b4189fd066f44e9f505364e0140a5cbe7d206dfd0f85300d45b3f64e33aa02b339f94cc95cd7bff39dd5f0a64fa1f639c73db63fcb58c1e01"));

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
