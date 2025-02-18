// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
//   handleRequest(err, user, info) {
//     // If there is no token, return null instead of throwing an error
//     if (err || !user) {
//       return null;
//     }
//     return user; // Return user if valid token exists
//   }
// }


import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { RequestWithUser } from './request-with-user.interface';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<any>();
    // If no token is provided, don't throw an error, just return null
    if (err || !user) {
      req.user = null;
      return null;
    }

    req.user = user;
    return user; // Return user if valid token exists
  }
}
