# PROJECT_ANALYSIS: c4-monitoring-monorepo

## Comprehensive Architectural Analysis

This document provides a complete analysis of the c4-monitoring-monorepo project, including architecture, patterns, conventions, and actual code examples.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Microservices Architecture](#3-microservices-architecture)
4. [CQRS Pattern Implementation](#4-cqrs-pattern-implementation)
5. [Orchestrator Pattern](#5-orchestrator-pattern)
6. [Security & Authentication](#6-security--authentication)
7. [Routing Conventions](#7-routing-conventions)
8. [Entity Patterns](#8-entity-patterns)
9. [DTO Patterns & Validation](#9-dto-patterns--validation)
10. [Inter-Service Communication](#10-inter-service-communication)
11. [Repository Pattern](#11-repository-pattern)
12. [Module Organization](#12-module-organization)
13. [Conventions & Standards](#13-conventions--standards)

---

## 1. Project Overview

**Project Name:** C4 Monitoring Monorepo
**Framework:** NestJS 10.x with TypeScript 5.x
**Architecture:** Microservices with API Gateway
**Message Broker:** RabbitMQ (AMQP)
**Database:** PostgreSQL 13 (separate DB per service)
**ORM:** TypeORM 0.3.x

### Purpose
Multi-church management system supporting member management, staff management, authentication, and scalable church campus operations.

---

## 2. Monorepo Structure

```
c4-monitoring-monorepo/
├── apps/                           # Microservices
│   ├── api-gateway/               # HTTP Entry Point (Port 3000)
│   ├── auth/                      # Authentication Service (Port 3001)
│   ├── church/                    # Church Management (Port 3002)
│   ├── members/                   # Member Management (Port 3003)
│   ├── events/                    # Events Service (Placeholder)
│   └── equipping/                 # Equipping Service (Placeholder)
├── libs/                          # Shared Libraries
│   └── libs/src/
│       ├── core/                  # Core utilities
│       │   ├── broker-commands.ts # RabbitMQ message patterns
│       │   ├── api-prefix.ts      # API versioning constants
│       │   └── abstract-controller.ts
│       ├── dto/                   # Shared DTOs
│       │   ├── auth/
│       │   ├── church/
│       │   └── member/
│       └── utils/
│           └── pipes/
├── docker-compose.yml
├── nest-cli.json
└── package.json
```

---

## 3. Microservices Architecture

### Service Communication Flow

```
Client Request
     │
     ▼
┌─────────────────────────────────┐
│    API Gateway (Port 3000)      │
│    - JWT Validation             │
│    - Rate Limiting              │
│    - Access Token Middleware    │
│    - Response Transformation    │
└─────────────────────────────────┘
              │
              ▼ (RabbitMQ)
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌─────────┐
│ Auth  │ │Church │ │ Members │
│ :3001 │ │ :3002 │ │  :3003  │
└───────┘ └───────┘ └─────────┘
    │         │         │
    ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌─────────┐
│auth_db│ │church │ │members  │
│ :5433 │ │_db    │ │_db      │
│       │ │ :5430 │ │  :5431  │
└───────┘ └───────┘ └─────────┘
```

### Service Responsibilities

| Service | Port | Database | Responsibilities |
|---------|------|----------|------------------|
| API Gateway | 3000 | None | HTTP routing, JWT validation, rate limiting |
| Auth | 3001 | auth_db:5433 | Login, token generation/refresh, user credentials |
| Church | 3002 | church_db:5430 | Church & campus management, staff assignments |
| Members | 3003 | members_db:5431 | Member profiles, contacts, relationships |

---

## 4. CQRS Pattern Implementation

### Command Structure

Commands represent write operations. Located in `apps/{service}/src/cqrs/commands/`.

**Example: CreateChurchCampusStaffCommand**
```typescript
// apps/church/src/cqrs/commands/create-church-campus-staff.command.ts
import { ChurchCampusStaffCreationDto } from "@app/libs/dto/church/church-campus-staff-creation.dto";

export interface CreateChurchCampusStaffCommandDto {
    campus_id: string;
    member_id: string;
    churchCampusStaffCreationDto: ChurchCampusStaffCreationDto
}

export class CreateChurchCampusStaffCommand {
    constructor(public createChurchCampusStaffCommandDto: CreateChurchCampusStaffCommandDto) {}
}
```

**Example: CreateMemberCommand**
```typescript
// apps/members/src/cqrs/commands/create-member.command.ts
import { MemberCreationDto } from "@app/libs/dto/member/member.creation.dto";

export class CreateMemberCommand {
    constructor(public memberCreationDto: MemberCreationDto) {}
}
```

### Query Structure

Queries represent read operations. Located in `apps/{service}/src/cqrs/queries/`.

**Example: GetChurchesQuery**
```typescript
// apps/church/src/cqrs/queries/get-churches.query.ts
import { PaginationDto } from "@app/libs";

export class GetChurchesQuery {
    constructor(public paginationDto: PaginationDto) {}
}
```

**Example: GetMembersByIdsQuery**
```typescript
// apps/members/src/cqrs/queries/get-members-by-ids-query.ts
export class GetMembersByIdsQuery {
    constructor(public readonly member_ids: string[]) {}
}
```

### Broker Commands (Message Patterns)

All message patterns are centralized in `libs/libs/src/core/broker-commands.ts`:

```typescript
// libs/libs/src/core/broker-commands.ts
export const AUTH_COMMAND = {
    AUTHENTICATE: "auth_authenticate",
    VALIDATE_TOKEN: "auth_validateToken",
    REFRESH_TOKEN: "auth_refreshToken"
}

export const CHURCH_COMMAND = {
    CREATE_CHURCH: 'create_church',
    CREATE_CHURCH_CAMPUS: 'create_church_campus',
    CREATE_CHURCH_CAMPUS_STAFF: 'create_church_campus_staff',
    GET_CHURCHES: 'get_churches',
    GET_CHURCH_BY_ID: 'get_church_by_id',
    GET_CHURCH_CAMPUS_BY_ID: 'get_church_campus_by_id',
    GET_CHURCH_CAMPUS_STAFFS: 'get_church_campus_staffs',
    GET_CHURCH_CAMPUS_STAFF_BY_MEMBER_ID: 'get_church_campus_staff_by_member_id',
    HEALTH_CHECK: 'health_check',
    UPDATE_CHURCH_CAMPUS: 'update_church_campus',
    DELETE_CHURCH_CAMPUS: 'delete_church_campus',
    FALLBACK_CREATE_CHURCH_CAMPUS_STAFF: 'fallback_create_church_campus_staff',
}

export const MEMBER_COMMAND = {
    CREATE_MEMBER: 'create_member',
    CREATE_CELL_MEMBER: 'create_cell_member',
    GET_MEMBER: 'get_member',
    GET_MEMBERS: 'get_members',
    GET_MEMBERS_BY_IDS: 'get_members_by_ids',
    GET_MEMBER_BY_AUTH_ID: 'get_member_by_auth_id',
    FALLBACK_CREATE_MEMBER: 'fallback_create_member',
}
```

---

## 5. Orchestrator Pattern

### Abstract Orchestrator (Template Method Pattern)

The project implements an orchestrator pattern using the Template Method design pattern. Each handler extends `AbstractOrchestrator`.

```typescript
// apps/church/src/orchestrations/abstract-orchestrator.ts
import { BadRequestException, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export abstract class AbstractOrchestrator<D, R> {

    constructor(protected readonly dataSource: DataSource) {}

    public async orchestrate(request: D): Promise<R> {
        try {
            const preprocessedData = await this.preProcess(request);
            const processedData: R = await this.doProcess(preprocessedData);
            return await this.postProcess(processedData);
        } catch (error) {
            if (error instanceof TypeError) {
                throw new BadRequestException('A TypeError occurred: ' + error.message);
            }
            throw error;
        }
    }

    protected abstract preProcess(request: D): Promise<D>;
    protected abstract doProcess(request: D): Promise<R>;
    protected abstract postProcess(data: R): Promise<R>
}
```

### Orchestrator Pipeline Phases

| Phase | Purpose | Usage |
|-------|---------|-------|
| `preProcess()` | Data validation, transformation, enrichment | Validate input, transform DTOs |
| `doProcess()` | Main business logic, transactions | Database operations, core logic |
| `postProcess()` | Response formatting, cleanup | Map to response DTOs |

### Command Handler Example (with Transaction)

```typescript
// apps/church/src/orchestrations/create-church-campus.handler.ts
@CommandHandler(CreateChurchCampusCommand)
export class CreateChurchCampusHandler extends AbstractOrchestrator<ChurchCampusCreationDto, any>
    implements ICommandHandler<CreateChurchCampusCommand> {

    constructor(
        protected readonly dataSource: DataSource,
        private readonly randomNumberGeneratorService: RandomNumberGeneratorService,
        private readonly churchCampusClosureService: ChurchCampusClosureService
    ) {
        super(dataSource);
    }

    execute(command: CreateChurchCampusCommand): Promise<any> {
        return this.orchestrate(command.churchCampusCreationDto);
    }

    protected async preProcess(request: ChurchCampusCreationDto): Promise<ChurchCampusCreationDto> {
        return request;
    }

    protected async doProcess(request: ChurchCampusCreationDto): Promise<any> {
        const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const createChurch = new Church();
            createChurch.name = request.church.name;
            createChurch.timezone = request.church.timezone;

            const church = await queryRunner.manager.save(Church, createChurch);

            const churchCampus = new ChurchCampus();
            churchCampus.church = church;
            churchCampus.church_campus_type = request.church_campus_type;
            churchCampus.tag_line = request.tag_line;
            churchCampus.description = request.description;
            churchCampus.reference_id = this.randomNumberGeneratorService.generateUnique8DigitNumber();

            const savedChurchCampus = await queryRunner.manager.save(ChurchCampus, churchCampus);

            for(const addressRequestDto of request.addresses) {
                const churchCampusAddress = new ChurchCampusAddress();
                churchCampusAddress.churchCampus = savedChurchCampus;
                churchCampusAddress.city = addressRequestDto.city;
                churchCampusAddress.location_name = addressRequestDto.location_name;
                churchCampusAddress.state = addressRequestDto.state;
                churchCampusAddress.street = addressRequestDto.street;
                churchCampusAddress.zip_code = addressRequestDto.zip_code;

                await queryRunner.manager.save(ChurchCampusAddress, churchCampusAddress);
            }

            await queryRunner.commitTransaction();
            return savedChurchCampus;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    protected async postProcess(data: any): Promise<any> {
        return data;
    }
}
```

### Query Handler Example

```typescript
// apps/church/src/orchestrations/get-churches.handler.ts
@QueryHandler(GetChurchesQuery)
export class GetChurchesHandler extends AbstractOrchestrator<PaginationDto, any>
    implements IQueryHandler<GetChurchesQuery> {

    constructor(protected readonly dataSource: DataSource,
                private readonly churchesRepository: ChurchesRepository) {
        super(dataSource);
    }

    execute(query: GetChurchesQuery): Promise<any> {
        return this.orchestrate(query.paginationDto);
    }

    protected async preProcess(request: PaginationDto): Promise<PaginationDto> {
        return await request;
    }

    protected async doProcess(request: PaginationDto): Promise<any> {
        const churches = await this.churchesRepository.findAll(request);
        return await churches;
    }

    protected async postProcess(data: any): Promise<any> {
        return await data;
    }
}
```

---

## 6. Security & Authentication

### JWT Strategy (Passport)

```typescript
// apps/api-gateway/src/strategy/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Custom extractor: tries cookie first, then Bearer header
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. Cookie extraction (web clients)
        (request: Request) => {
          return request?.cookies?.ACCESS_TOKEN || null;
        },
        // 2. Bearer token (mobile/API clients)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

### JWT Auth Guard

```typescript
// apps/api-gateway/src/guards/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### Cookie Configuration

```typescript
// apps/api-gateway/src/config/cookie-config.service.ts
@Injectable()
export class CookieConfigService {
  private readonly isProduction = process.env.NODE_ENV === 'production';

  // Access Token: 15 minutes
  getAccessTokenCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    };
  }

  // Refresh Token: 7 days
  getRefreshTokenCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
    };
  }

  readonly COOKIE_NAMES = {
    ACCESS_TOKEN: 'ACCESS_TOKEN',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
  } as const;
}
```

### Access Token Middleware (API Security Layer)

```typescript
// apps/api-gateway/src/middleware/access-token-middleware.ts
@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
  constructor(private readonly apiCryptoService: ApiCryptoService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.header('X-ACCESS-TOKEN');
    const tokenTime = req.header('X-ACCESS');

    const decryptedToken = this.apiCryptoService.decrypt(token);
    const decryptedTokenTime = this.apiCryptoService.decrypt(tokenTime);

    if (!token || !tokenTime) {
      return res.status(403).json({ message: 'Access token missing' });
    }

    const currentTime = new Date().getTime();
    const isWithinInFiveMinutes =
      (currentTime - Number(decryptedTokenTime)) <= Number(process.env.X_ACCESS_TOKEN_VALIDITY);

    if ((process.env.X_ACCESS_TOKEN_KEY !== decryptedToken) || !isWithinInFiveMinutes) {
      return res.status(403).json({ message: 'Access token invalid' });
    }

    next();
  }
}
```

### Auth Service (Token Generation)

```typescript
// apps/auth/src/auth.service.ts
async login(email: string, pass: string) {
  const user = await this.validateUser(email, pass);
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Access Token (15m)
  const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });

  // Refresh Token (7d) - separate secret
  const refreshToken = this.jwtService.sign(
    { sub: user.id, email: user.email },
    {
      secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET',
      expiresIn: '7d'
    },
  );

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}

async refresh(refreshToken: string) {
  try {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET',
    });

    const user = await this.getUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const newAccessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    const newRefreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET', expiresIn: '7d' },
    );

    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  } catch (err) {
    throw new UnauthorizedException('Invalid or expired refresh token');
  }
}
```

### Rate Limiting

```typescript
// apps/api-gateway/src/api-gateway.module.ts
@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL || '60000'),  // 60 seconds
      limit: parseInt(process.env.THROTTLE_LIMIT || '30'), // 30 requests
    }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
```

### Security Summary Table

| Feature | Implementation |
|---------|----------------|
| JWT Tokens | Access (15m) + Refresh (7d) with separate secrets |
| Cookie Security | HTTPOnly, Secure, SameSite |
| Password Hashing | bcryptjs with salt=10 |
| Rate Limiting | Global 30 req/60s, Auth endpoint 5 req/60s |
| API Access Token | Encrypted X-ACCESS-TOKEN header |
| CORS | Whitelist-based with credentials |

---

## 7. Routing Conventions

### API Prefix Standard

```typescript
// libs/libs/src/core/api-prefix.ts
export const API_PREFIX = {
  V1: 'api/v1',
  API: 'api'
};
```

### Controller URL Pattern

Format: `/{API_PREFIX.V1}/{resource}`

**Examples:**
- `/api/v1/auth` - Authentication endpoints
- `/api/v1/churches` - Church management
- `/api/v1/members` - Member management
- `/api/v1/church-campus` - Campus management

### Controller Structure

```typescript
// apps/api-gateway/src/controllers/members/members-controller.ts
@Controller(`${API_PREFIX.V1}/members`)
@UseFilters(AllExceptionsFilter)
export class MembersController {
    constructor(private membersService: MembersService,
                private authService: AuthService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe)
    async createMember(@AuthUser() loggedInUser: any,
                       @Body() body: MemberCreationDto) {
        try {
            return await this.membersService.createMember(body);
        } catch(error: any) {
            throw error;
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe)
    async getMembers(@AuthUser() loggedInUser: any,
                     @Query() queryParams: any) {
        const currentUser = await this.authService.getSelfInformation(loggedInUser.userId);
        try {
            return this.membersService.getMembers(queryParams);
        } catch(error: any) {
            throw error;
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe)
    async getMember(@Param('id') id: string) {
        try {
            return await this.membersService.getMember(id);
        } catch(error: any) {
            throw error;
        }
    }
}
```

### Standard Controller Decorators

| Decorator | Purpose |
|-----------|---------|
| `@Controller()` | Define route prefix |
| `@UseFilters(AllExceptionsFilter)` | Global error handling |
| `@UseGuards(JwtAuthGuard)` | Require authentication |
| `@UseInterceptors(TransformResponseInterceptor)` | Wrap response |
| `@UsePipes(ValidationPipe)` | DTO validation |

---

## 8. Entity Patterns

### Entity Conventions

- UUID primary keys
- Indexed foreign keys
- TypeORM decorators
- Cascade relationships

### Church Entity

```typescript
// apps/church/src/entities/church.entity.ts
@Entity()
@Index(['id'], { unique: true })
export class Church {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  timezone: string;

  @OneToMany(() => ChurchCampus, churchCampus => churchCampus.church)
  church_campuses: ChurchCampus[];

  @OneToMany(() => ChurchAddress, churchAddress => churchAddress.church)
  church_addresses: ChurchAddress[];

  @OneToMany(() => ChurchStaff, churchStaff => churchStaff.church)
  church_staffs: ChurchStaff[];

  @OneToOne(() => ChurchContactInfo, churchContactInfo => churchContactInfo.church,
            {cascade: true, eager: true})
  church_contact_info: ChurchContactInfo;
}
```

### Member Entity

```typescript
// apps/members/src/entities/member.entity.ts
@Entity()
@Index(['id'], { unique: true })
export class Member {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'uuid', name: 'church_id', nullable: false })
    church_id: string;

    @Index()
    @Column({ type: 'uuid', name: 'auth_id', nullable: true })
    auth_id: string;

    @Index()
    @Column({ type: 'uuid', name: 'church_campus_id', nullable: true })
    church_campus_id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    photo_url: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    first_name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    last_name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ type: 'timestamptz', nullable: true })
    birthdate: Date;

    @Column({ type: 'enum', enum: GenderEnum, nullable: true })
    gender: GenderEnum;

    @Column({ type: 'enum', enum: AffliationEnum, nullable: true })
    affliation: AffliationEnum;

    @Index()
    @Column({ type: 'uuid', name: 'invited_by', nullable: true })
    invited_by: string;

    @OneToMany(() => MemberAddress, memberAddress => memberAddress.member,
               { cascade: ['insert', 'update'] })
    member_addresses: MemberAddress[];

    @OneToMany(() => ContactInfo, contactInfo => contactInfo.member,
               { cascade: ['insert', 'update'] })
    contact_infos: ContactInfo[];

    @OneToMany(() => SocialInfo, socialInfo => socialInfo.member,
               { cascade: ['insert', 'update'] })
    social_infos: SocialInfo[];

    @OneToMany(() => ConsolidateMember, cm => cm.consolidator)
    consolidator_members: ConsolidateMember[];

    @OneToMany(() => ConsolidateMember, cm => cm.consolidatee)
    consolidatee_members: ConsolidateMember[];
}
```

---

## 9. DTO Patterns & Validation

### Validation Decorators

Using `class-validator` and `class-transformer`:

```typescript
// libs/libs/src/dto/church/church-campus-creation.ts
import { IsString, IsEnum, ValidateNested, IsDefined, IsOptional, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

enum ChurchCampusType {
    MAIN = 'MAIN',
    BRANCH = 'BRANCH',
}

export class ChurchCampusCreationDto {
    @IsEnum(ChurchCampusType, { message: 'Church campus type must be a valid enum value' })
    @IsString({ message: 'Church campus type is required' })
    church_campus_type: ChurchCampusType;

    @IsString()
    @IsOptional()
    tag_line?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDefined({ message: 'Church is required' })
    @ValidateNested()
    @Type(() => ChurchCreationDto)
    church: ChurchCreationDto;

    @IsDefined({ message: 'At least one address is required' })
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1, { message: 'At least one address must be provided' })
    @Type(() => ChurchCampusAddressCreationDto)
    addresses: ChurchCampusAddressCreationDto[];
}
```

### DTO Organization

```
libs/libs/src/dto/
├── auth/
│   └── auth-creds.dto.ts
├── church/
│   ├── church.dto.ts
│   ├── church-creation.dto.ts
│   ├── church-campus.dto.ts
│   ├── church-campus-creation.ts
│   └── church-campus-staff-creation.dto.ts
├── member/
│   ├── member.dto.ts
│   ├── member.creation.dto.ts
│   └── member-address.creation.dto.ts
├── pagination.dto.ts
├── gender-enum.ts
└── generic-status.enum.ts
```

---

## 10. Inter-Service Communication

### RabbitMQ Module Configuration

```typescript
// apps/api-gateway/src/microservices/members-microservice/members-microservice.module.ts
let rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672';
rabbitMqUrl = rabbitMqUrl.includes('?')
  ? `${rabbitMqUrl}&frameMax=8192`
  : `${rabbitMqUrl}?frameMax=8192`;

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MEMBERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [rabbitMqUrl],
          queue: 'members_queue',
          queueOptions: {
            durable: false,
          }
        },
      },
    ]),
  ],
  providers: [MembersMicroserviceService],
  exports: [MembersMicroserviceService]
})
export class MembersMicroserviceModule {}
```

### Microservice Client Service

```typescript
// apps/api-gateway/src/microservices/members-microservice/members-microservice.service.ts
@Injectable()
export class MembersMicroserviceService {

    constructor(@Inject('MEMBERS_SERVICE') private readonly membersClient: ClientProxy) {}

    async getMemberByAuthId(auth_id: string) {
        try {
            const memberResponse = await this.membersClient.send(
                { cmd: MEMBER_COMMAND.GET_MEMBER_BY_AUTH_ID },
                { auth_id }
            );
            return await lastValueFrom(memberResponse);
        } catch(error) {
            throw error;
        }
    }

    async createMember(memberCreationDto: MemberCreationDto): Promise<MemberDto> {
        try {
            const memberResponse = await this.membersClient.send(
                { cmd: MEMBER_COMMAND.CREATE_MEMBER },
                memberCreationDto
            );
            return await lastValueFrom(memberResponse);
        } catch(error) {
            throw error;
        }
    }
}
```

### Microservice Controller (Message Pattern Handlers)

```typescript
// apps/members/src/members.controller.ts
@Controller()
export class MembersController {
  constructor(private readonly membersService: MembersService,
              private readonly commandBus: CommandBus,
              private readonly queryBus: QueryBus) {}

  @MessagePattern({cmd: MEMBER_COMMAND.GET_MEMBER_BY_AUTH_ID})
  async getMemberByAuthId(data: any) {
    try {
      return await this.queryBus.execute(new GetMemberByAuthIdQuery(data.auth_id));
    } catch(error) {
      throw error;
    }
  }

  @MessagePattern({cmd: MEMBER_COMMAND.CREATE_MEMBER})
  async createMember(data: MemberCreationDto) {
    try {
      return await this.commandBus.execute(new CreateMemberCommand(data));
    } catch(error) {
      throw error;
    }
  }
}
```

---

## 11. Repository Pattern

### Repository Structure

```typescript
// apps/members/src/repositories/member-repositories.ts
@Injectable()
export class MemberRepository {
    constructor(@InjectRepository(Member)
                private readonly memberRepository: Repository<Member>) {}

    async findManyByIds(member_ids: string[]): Promise<Member[]> {
        return this.memberRepository.find({
            where: { id: In(member_ids) }
        });
    }

    async findByAuthId(auth_id: string): Promise<Member> {
        return this.memberRepository.findOne({
            where: { auth_id: auth_id }
        });
    }

    async findAll(request: any): Promise<any> {
        const queryBuilder = this.memberRepository.createQueryBuilder('member')
            .leftJoinAndSelect('member.member_addresses', 'member_addresses')
            .leftJoinAndSelect('member.contact_infos', 'contact_infos')
            .leftJoinAndSelect('member.social_infos', 'social_infos')
            .leftJoinAndSelect('member.consolidatee_members', 'consolidatee_members')
            .leftJoinAndSelect('consolidatee_members.consolidator', 'consolidator')
            .where("1=1");

        const paginationDto: PaginationDto = {
            limit: request.pageSize,
            page: request.page
        };

        if(request.gender) {
           queryBuilder.andWhere('member.gender = :gender', { gender: request.gender });
        }

        if (paginationDto.page && paginationDto.limit) {
            queryBuilder
                .skip((paginationDto.page - 1) * paginationDto.limit)
                .take(paginationDto.limit);
        }

        const [data, total] = await queryBuilder.getManyAndCount();

        return { members: data, total };
    }
}
```

---

## 12. Module Organization

### Service Module Structure

```typescript
// apps/members/src/members.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('typeorm'),
      }),
    }),

    TypeOrmModule.forFeature([
      ChangeTrackProgress, ChangeTrack, ChurchCampusMember,
      ConsolidateMember, ContactInfo, MemberDevotional,
      Member, SocialInfo
    ]),
    CqrsModule
  ],
  controllers: [MembersController],
  providers: [
    MembersService,
    MemberRepository,
    ChurchCampusMemberRepository,
    // Command Handlers
    CreateChurchCampusMemberClosureHandler,
    CreateMemberHandler,
    CreateCellMemberHandler,
    FallbackCreateMemberHandler,
    // Query Handlers
    GetMembersByIdsHandler,
    GetMemberByAUthIdHandler,
    GetMembersHandler,
    // Services
    ChurchCampusClosureService,
    DiscipleshipService
  ],
})
export class MembersModule {}
```

### API Gateway Module

```typescript
// apps/api-gateway/src/api-gateway.module.ts
@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL || '60000'),
      limit: parseInt(process.env.THROTTLE_LIMIT || '30'),
    }]),
    AuthMicroserviceModule,
    ChurchMicroserviceModule,
    MembersMicroserviceModule,
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET_KEY',
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessTokenMiddleware)
      .forRoutes('*');
  }
}
```

---

## 13. Conventions & Standards

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `church-campus.entity.ts` |
| Classes | PascalCase | `ChurchCampusController` |
| Variables | camelCase | `churchCampus` |
| Database columns | snake_case | `church_campus_id` |
| Constants | SCREAMING_SNAKE_CASE | `MEMBER_COMMAND` |
| Enums | PascalCase | `GenderEnum`, `ChurchCampusType` |

### File Organization

```
apps/{service}/src/
├── cqrs/
│   ├── commands/           # Command classes
│   └── queries/            # Query classes
├── entities/               # TypeORM entities
├── orchestrations/         # CQRS handlers + orchestrators
├── repositories/           # Data access layer
├── service/                # Business logic services
├── {service}.controller.ts # Main controller
├── {service}.module.ts     # Module definition
└── {service}.service.ts    # Service entry point
```

### Response Format

```typescript
// apps/api-gateway/src/interceptors/transform-response.interceptor.ts
@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, { data?: T; statusCode: number; error?: any }> {

  intercept(context: ExecutionContext, next: CallHandler): Observable<...> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        data,
        statusCode: response.statusCode,
      })),
      catchError((error) => {
        let statusCode = error?.statusCode || 400;
        return throwError(() => ({
          statusCode,
          error: error.message || 'Internal Server Error',
        }));
      }),
    );
  }
}
```

### Standard Response Structure

**Success:**
```json
{
  "data": { ... },
  "statusCode": 200
}
```

**Error:**
```json
{
  "data": null,
  "statusCode": 400,
  "error": "Error message"
}
```

---

## Quick Reference

### Key Files by Purpose

| Purpose | Location |
|---------|----------|
| Message Patterns | `libs/libs/src/core/broker-commands.ts` |
| API Prefix | `libs/libs/src/core/api-prefix.ts` |
| JWT Strategy | `apps/api-gateway/src/strategy/jwt.strategy.ts` |
| Auth Guard | `apps/api-gateway/src/guards/guards/jwt-auth.guard.ts` |
| Abstract Orchestrator | `apps/{service}/src/orchestrations/abstract-orchestrator.ts` |
| Cookie Config | `apps/api-gateway/src/config/cookie-config.service.ts` |
| Access Token Middleware | `apps/api-gateway/src/middleware/access-token-middleware.ts` |
| Response Interceptor | `apps/api-gateway/src/interceptors/transform-response.interceptor.ts` |

### Port Assignments

| Service | Port |
|---------|------|
| API Gateway | 3000 |
| Auth | 3001 |
| Church | 3002 |
| Members | 3003 |
| church_db | 5430 |
| members_db | 5431 |
| auth_db | 5433 |
| RabbitMQ | 5672 |
| RabbitMQ Management | 15672 |

---

*This PROJECT_ANALYSIS was generated from actual code analysis of the c4-monitoring-monorepo.*
