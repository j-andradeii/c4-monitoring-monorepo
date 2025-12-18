import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'; // Import APP_GUARD
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'; // Import Throttler
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './service/api-gateway.service';
import { AuthMicroserviceModule } from './microservices/auth-microservice/auth-microservice.module';
import { AuthController } from './controllers/auth/auth-controller';
import { ChurchMicroserviceModule } from './microservices/church-microservice/church-microservice.module';
import { ChurchController } from './controllers/church/church-controller';
import { MembersMicroserviceModule } from './microservices/members-microservice/members-microservice.module';
import { MembersController } from './controllers/members/members-controller';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AccessTokenMiddleware } from './middleware/access-token-middleware';
import { ApiCryptoService } from './service/api-crypto-service';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { ChurchCampusController } from './controllers/church/church-campus.controller';
import { ChurchService } from './service/church-service';
import { AuthService } from './service/auth.service';
import { SelfController } from './controllers/auth/self-controller';
import { MembersService } from './service/member.service';
import { CellMembersController } from './controllers/members/cell-member-controller';
import { CookieConfigService } from './config/cookie-config.service';

@Module({
  imports: [
    // Configure ThrottlerModule
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL || '60000'), // Time-to-live in milliseconds (default: 60 seconds)
      limit: parseInt(process.env.THROTTLE_LIMIT || '30'), // Max requests per TTL (default: 10)
    }]),
    AuthMicroserviceModule,
    ChurchMicroserviceModule,
    MembersMicroserviceModule,
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET_KEY', // match Auth microservice
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
  ],
  controllers: [
    ApiGatewayController,
    AuthController,
    SelfController,
    ChurchController,
    ChurchCampusController,
    MembersController,
    CellMembersController
  ],
  providers: [
    ApiGatewayService,
    JwtStrategy,
    ApiCryptoService,
    TransformResponseInterceptor,
    ChurchService,
    AuthService,
    MembersService,
    CookieConfigService,
    // Apply ThrottlerGuard globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ApiGatewayModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessTokenMiddleware)     // the middleware
      .forRoutes('*');                 // apply to all routes or specify specific route paths
  }
}
