import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
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
import { ApiCryptoService } from './api-crypto-service';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { ChurchCampusController } from './controllers/church/church-campus.controller';

@Module({
  imports: [
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
    ChurchController,
    ChurchCampusController,
    MembersController
  ],
  providers: [
    ApiGatewayService, 
    JwtStrategy,
    ApiCryptoService,
    TransformResponseInterceptor
  ],
})
export class ApiGatewayModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessTokenMiddleware)     // the middleware
      .forRoutes('*');                 // apply to all routes or specify specific route paths
  }
}
