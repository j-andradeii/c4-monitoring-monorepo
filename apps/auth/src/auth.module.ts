import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './orm-config';
import { AuthRepository } from './repositories/auth.repositories';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // Should be in env
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }, // Access token expiry
    }),

    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the app
      load: [typeorm], // Load your TypeORM configuration
    }),
        
    // Asynchronously load TypeORM configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to access ConfigService
      inject: [ConfigService], // Inject the ConfigService
      useFactory: (configService: ConfigService) => ({
        ...configService.get('typeorm'), // Get the TypeORM config
      }),
    }),
    
    TypeOrmModule.forFeature([
        Auth
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository
  ],
})
export class AuthModule {}
