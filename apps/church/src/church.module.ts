import { Module } from '@nestjs/common';
import { ChurchController } from './church.controller';
import { ChurchService } from './church.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './orm-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Church } from './entities/church.entity';
import { ChurchAddress } from './entities/church-address.entity';
import { ChurchContactInfo } from './entities/church-contact-info.entity';
import { ChurchCampus } from './entities/church-campus.entity';
import { CreateChurchHandler } from './orchestrations/create-church.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateChurchCampusHandler } from './orchestrations/create-church-campus.handler';
import { RandomNumberGeneratorService } from './service/random-number-generator.service';
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

    TypeOrmModule.forFeature([Church, ChurchAddress, ChurchContactInfo, ChurchCampus ]),
    CqrsModule
  ],
  controllers: [
    ChurchController
  ],
  providers: [  
    ChurchService,
    CreateChurchHandler,
    CreateChurchCampusHandler,
    ChurchCampusClosureService,
    RandomNumberGeneratorService    
  ],
})
export class ChurchModule {}
