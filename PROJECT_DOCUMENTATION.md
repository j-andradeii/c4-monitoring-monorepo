# C4 Monitoring Monorepo - Comprehensive Project Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Design Patterns](#design-patterns)
- [Technology Stack](#technology-stack)
- [Service Details](#service-details)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)

## Project Overview

The C4 Monitoring Monorepo is a microservices-based church management system built with NestJS. It provides comprehensive functionality for managing church operations, including member management, church campus administration, and authentication services.

### Key Features
- **Multi-church Support**: Manage multiple church locations and campuses
- **Member Management**: Complete member profiles with contact information and social connections
- **Staff Management**: Assign and manage church staff with role-based permissions
- **Authentication**: Secure JWT-based authentication with refresh tokens
- **Scalable Architecture**: Microservices design allowing independent scaling

## Architecture

### High-Level Architecture

```
┌─────────────────┐     ┌──────────────────────────────────────────┐
│                 │     │            API Gateway (3000)             │
│     Client      │────▶│  - JWT Authentication                    │
│   Application   │     │  - Request Routing                       │
│                 │     │  - Rate Limiting                         │
└─────────────────┘     └────────────┬────────────────────────────┘
                                     │
                        ┌────────────┼────────────┐
                        │         RabbitMQ        │
                        │    Message Broker       │
                        └────┬───────┬───────┬────┘
                             │       │       │
                    ┌────────▼─┐ ┌───▼────┐ ┌▼─────────┐
                    │   Auth   │ │ Church │ │ Members  │
                    │ Service  │ │Service │ │ Service  │
                    │  (3001)  │ │ (3002) │ │  (3003)  │
                    └────┬─────┘ └───┬────┘ └────┬─────┘
                         │           │            │
                    ┌────▼─────┐ ┌───▼────┐ ┌────▼─────┐
                    │PostgreSQL│ │Postgres│ │PostgreSQL│
                    │  (5433)  │ │ (5430) │ │  (5431)  │
                    └──────────┘ └────────┘ └──────────┘
```

### Communication Flow

1. **Client → API Gateway**: HTTP/HTTPS requests with JWT tokens
2. **API Gateway → Microservices**: RabbitMQ message queue (Request-Reply pattern)
3. **Inter-service Communication**: Asynchronous messaging via RabbitMQ
4. **Database Access**: Each service maintains its own PostgreSQL instance

## Project Structure

```
c4-monitoring-monorepo/
├── apps/                          # Application services
│   ├── api-gateway/              # API Gateway service
│   │   ├── src/
│   │   │   ├── controllers/      # Route controllers
│   │   │   ├── guards/          # Authentication guards
│   │   │   ├── interceptors/    # Request/response interceptors
│   │   │   ├── microservices/   # Service clients
│   │   │   └── strategy/        # Passport strategies
│   │   └── Dockerfile
│   ├── auth/                    # Authentication service
│   │   ├── src/
│   │   │   ├── entities/       # Database entities
│   │   │   ├── repositories/   # Data access layer
│   │   │   └── db/migrations/  # Database migrations
│   │   └── Dockerfile
│   ├── church/                  # Church management service
│   │   ├── src/
│   │   │   ├── cqrs/          # Commands and queries
│   │   │   ├── entities/      # Database entities
│   │   │   ├── orchestrations/ # Business logic handlers
│   │   │   └── repositories/  # Data access layer
│   │   └── Dockerfile
│   └── members/                # Member management service
│       ├── src/
│       │   ├── cqrs/         # Commands and queries
│       │   ├── entities/     # Database entities
│       │   ├── orchestrations/# Business logic handlers
│       │   └── repositories/ # Data access layer
│       └── Dockerfile
├── libs/                      # Shared libraries
│   └── libs/
│       └── src/
│           ├── core/         # Core abstractions
│           ├── dto/          # Shared DTOs
│           └── utils/        # Utility functions
├── docker-compose.yml        # Docker orchestration
├── nest-cli.json            # NestJS CLI configuration
└── package.json             # Project dependencies
```

## Design Patterns

### 1. **Microservices Pattern**
- Each domain (Auth, Church, Members) is a separate service
- Services communicate via message queuing (RabbitMQ)
- Database per service for data isolation

### 2. **API Gateway Pattern**
- Single entry point for all client requests
- Handles authentication, routing, and aggregation
- Implements cross-cutting concerns (rate limiting, logging)

### 3. **CQRS (Command Query Responsibility Segregation)**
- Separation of read and write operations
- Commands: `CreateMemberCommand`, `CreateChurchCommand`
- Queries: `GetMembersQuery`, `GetChurchCampusByIdQuery`

### 4. **Repository Pattern**
- Abstraction over data access logic
- Each entity has its own repository
- Supports complex queries and transactions

### 5. **Orchestrator Pattern**
- `AbstractOrchestrator` base class for business logic
- Three-phase processing: preProcess, doProcess, postProcess
- Consistent error handling and transaction management

### 6. **Decorator Pattern**
- `@AuthUser()` decorator for injecting authenticated user
- `@MessagePattern()` for RabbitMQ message handling
- Custom validation decorators

### 7. **Strategy Pattern**
- JWT authentication strategy using Passport.js
- Extensible authentication mechanism

### 8. **Saga Pattern (Basic Implementation)**
- Distributed transaction handling
- Compensating transactions for rollback
- Example: Creating church campus staff across services

## Technology Stack

### Core Framework
- **NestJS 10.x**: Progressive Node.js framework
- **TypeScript 5.x**: Type-safe JavaScript
- **Node.js**: Runtime environment

### Database
- **PostgreSQL 13**: Primary database
- **TypeORM 0.3.x**: Object-Relational Mapping
- **Database Migrations**: Version-controlled schema changes

### Messaging
- **RabbitMQ**: Message broker with management UI
- **AMQP**: Advanced Message Queuing Protocol
- **NestJS Microservices**: Built-in microservice support

### Authentication & Security
- **Passport.js**: Authentication middleware
- **JWT (jsonwebtoken)**: Token-based authentication
- **bcryptjs**: Password hashing
- **@nestjs/throttler**: Rate limiting

### Development Tools
- **Docker & Docker Compose**: Containerization
- **ESLint & Prettier**: Code quality and formatting
- **Jest**: Testing framework
- **Nodemon**: Development hot-reload

## Service Details

### API Gateway Service
- **Port**: 3000
- **Responsibilities**:
  - Request routing and aggregation
  - JWT token validation
  - Rate limiting (30 req/60s global, 5 req/60s for auth)
  - Access token middleware for API security
  - Response transformation

### Auth Service
- **Port**: 3001
- **Database**: PostgreSQL (5433)
- **Features**:
  - User authentication (login/logout)
  - JWT token generation and refresh
  - Password encryption and validation
  - User credential management

### Church Service
- **Port**: 3002
- **Database**: PostgreSQL (5430)
- **Features**:
  - Church and campus management
  - Staff assignment and roles
  - Hierarchical data with closure tables
  - Address and contact management

### Members Service
- **Port**: 3003
- **Database**: PostgreSQL (5431)
- **Features**:
  - Member profile management
  - Contact information (email, phone)
  - Social media connections
  - Address management
  - Member relationships

## Development Workflow

### Local Development

1. **Environment Setup**:
   ```bash
   # Copy environment variables
   cp .env.example .env
   
   # Install dependencies
   npm install
   ```

2. **Database Setup**:
   ```bash
   # Start databases with Docker
   docker-compose up -d church-db members-db auth-db
   
   # Run migrations
   npm run migration:run:auth
   npm run migration:run:church
   npm run migration:run:members
   ```

3. **Start Services**:
   ```bash
   # Start all services
   docker-compose up
   
   # Or start individually
   npm run start:gateway
   npm run start:auth
   npm run start:church
   npm run start:members
   ```

### Database Migrations

Create new migrations:
```bash
npm run migration:create:auth
npm run migration:create:church
npm run migration:create:members
```

Generate migrations from entities:
```bash
npm run migration:generate:auth
npm run migration:generate:church
npm run migration:generate:members
```

### Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

### Railway Deployment

The project includes Railway-specific deployment scripts:

```bash
# Deploy services
npm run railway:deploy:auth
npm run railway:deploy:church
npm run railway:deploy:members
```

### Docker Deployment

Each service has its own Dockerfile for containerized deployment:

```bash
# Build all services
docker-compose build

# Deploy with Docker Compose
docker-compose up -d
```

### Production Considerations

1. **Environment Variables**:
   - JWT_SECRET: Strong secret for token signing
   - JWT_EXPIRES_IN: Token expiration time
   - X_ACCESS_TOKEN_*: API access control
   - Database credentials per service

2. **Security**:
   - Enable HTTPS in production
   - Use strong JWT secrets
   - Implement proper CORS policies
   - Regular security audits

3. **Monitoring**:
   - Health checks for each service
   - Centralized logging
   - Performance monitoring
   - Error tracking

4. **Scaling**:
   - Services can be scaled independently
   - RabbitMQ clustering for high availability
   - Database replication for read scaling
   - Load balancing for API Gateway

## Best Practices

1. **Code Organization**:
   - Domain-driven design principles
   - Clear separation of concerns
   - Shared code in libs directory

2. **Error Handling**:
   - Consistent error responses
   - RPC exception filters
   - Global exception handling

3. **Data Validation**:
   - DTO validation with class-validator
   - Custom validation pipes
   - Type safety with TypeScript

4. **Testing**:
   - Unit tests for business logic
   - Integration tests for APIs
   - E2E tests for critical flows

5. **Documentation**:
   - API documentation with Swagger (to be implemented)
   - Code comments for complex logic
   - README files for each service