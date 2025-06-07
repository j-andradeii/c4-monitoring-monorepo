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
import { ChangeTrackProgress } from './entities/change-track-progress.entity';
import { ChangeTrack } from './entities/change-track.entity';
import { ChurchCampusMember } from './entities/church-campus-member.entity';
import { ConsolidateMember } from './entities/consolidate-member.entity';
import { ContactInfo } from './entities/contact-info.entity';
import { MemberDevotional } from './entities/member-devotional.entity';
import { SocialInfo } from './entities/social-infos.entity';
import { GetMemberByAUthIdHandler } from './orchestrations/get-member-by-auth-id.handler';
import { ChurchCampusMemberRepository } from './repositories/church-campus-member.repositories';
import { GetMembersHandler } from './orchestrations/get-members.handler';
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

    TypeOrmModule.forFeature([
      ChangeTrackProgress,
      ChangeTrack,
      ChurchCampusMember,
      ConsolidateMember,
      ContactInfo,
      MemberDevotional,
      Member,
      SocialInfo
    ]),
    CqrsModule
  ],
  controllers: [MembersController],
  providers: [
    MembersService,
    MemberRepository,
    ChurchCampusMemberRepository,
    CreateChurchCampusMemberClosureHandler,
    CreateMemberHandler,
    GetMembersByIdsHandler,
    GetMemberByAUthIdHandler,
    FallbackCreateMemberHandler,
    GetMembersHandler,
    ChurchCampusClosureService,
    DiscipleshipService
  ],
})
export class MembersModule {}
