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
import { CreateMemberHandler } from './orchestrations/create-member.handler';
import { FallbackCreateMemberHandler } from './orchestrations/fallback-create-member.handler';
import { DiscipleshipService } from './service/discipleship.service';
import { MemberRepository } from './repositories/member-repositories';
import { GetMembersByIdsHandler } from './orchestrations/get-member-by-ids.handler';
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
    MemberRepository,
    CreateChurchCampusMemberClosureHandler,
    CreateMemberHandler,
    GetMembersByIdsHandler,
    FallbackCreateMemberHandler,
    ChurchCampusClosureService,
    DiscipleshipService
  ],
})
export class MembersModule {}
