import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import typeorm from './orm-config';
import { CreateChurchCampusMemberClosureHandler } from './orchestrations/create-church-campus-member-closure.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { ChurchCampusClosureService } from './service/church-campus-closure.service';

@Module({
  imports: [
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

    TypeOrmModule.forFeature([Member]),
    CqrsModule
  ],
  controllers: [MembersController],
  providers: [
    MembersService,
    CreateChurchCampusMemberClosureHandler,
    ChurchCampusClosureService
  ],
})
export class MembersModule {}
