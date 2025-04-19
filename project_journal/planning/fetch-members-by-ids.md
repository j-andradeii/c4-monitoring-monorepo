# Fetching Members by IDs from Member Microservice

This document explains how to fetch member details from the Member microservice using a list of member IDs extracted from church campus staff records.

## The Challenge

You have a list of church campus staff records that include member IDs:

```json
"staffs": [
    {
        "id": "c6bce48f-83e7-4670-b66c-4ef218a1e609",
        "member_id": "7bf5073a-dda5-4d2b-8510-1a76c6582336",
        "is_hierarchy_root": true,
        "role": "PASTOR"
    },
    {
        "id": "cf1d9dde-c2f8-4bb5-b4e1-982c2941b79e",
        "member_id": "62447fd5-b8a3-4278-bca6-b4f389b6c739",
        "is_hierarchy_root": true,
        "role": "PASTOR"
    },
    {
        "id": "a7e60c80-1110-41e4-9528-859a03cdd32d",
        "member_id": "a49e83e7-951e-4c89-a10a-f09ed31d20c4",
        "is_hierarchy_root": false,
        "role": "PRIMARY"
    }
]
```

You need to fetch the corresponding member details from the Member microservice to enrich this data.

## Solution

### Step 1: Create a Member Microservice Service

First, create a service to communicate with the Member microservice, similar to the existing ChurchMicroserviceService:

```typescript
// apps/api-gateway/src/microservices/member-microservice/member-microservice.service.ts

import { MEMBER_COMMAND } from '@app/libs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MemberMicroserviceService {
    constructor(@Inject('MEMBER_SERVICE') private readonly memberClient: ClientProxy) {}

    async getMembersByIds(memberIds: string[]): Promise<any[]> {
        try {
            const membersResponse = this.memberClient.send(
                { cmd: MEMBER_COMMAND.GET_MEMBERS },
                { memberIds }  // Pass the array of member IDs
            );
            return await lastValueFrom(membersResponse);
        } catch (error) {
            throw error;
        }
    }
}
```

### Step 2: Register the Member Microservice in the Module

Make sure the Member microservice client is registered in your module:

```typescript
// apps/api-gateway/src/app.module.ts or appropriate module

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MemberMicroserviceService } from './microservices/member-microservice/member-microservice.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'MEMBER_SERVICE',
                transport: Transport.TCP,  // Or RMQ, KAFKA, etc. based on your setup
                options: {
                    host: 'localhost',
                    port: 3002,  // Adjust port as needed
                },
            },
        ]),
        // Other imports...
    ],
    providers: [MemberMicroserviceService],
    exports: [MemberMicroserviceService],
})
export class AppModule {}
```

### Step 3: Implement the Handler in the Member Microservice

In the Member microservice, implement the handler for the GET_MEMBERS command:

```typescript
// apps/members/src/members.controller.ts

import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MEMBER_COMMAND } from '@app/libs';
import { MembersService } from './members.service';

@Controller()
export class MembersController {
    constructor(private readonly membersService: MembersService) {}

    @MessagePattern({ cmd: MEMBER_COMMAND.GET_MEMBERS })
    async getMembers(data: { memberIds: string[] }) {
        return this.membersService.findManyByIds(data.memberIds);
    }
}
```

And the corresponding service method:

```typescript
// apps/members/src/members.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Member } from './entities/member.entity';

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(Member)
        private membersRepository: Repository<Member>,
    ) {}

    async findManyByIds(ids: string[]): Promise<Member[]> {
        if (!ids || ids.length === 0) {
            return [];
        }
        
        return this.membersRepository.find({
            where: { id: In(ids) }
        });
    }
}
```

### Step 4: Use the Service to Fetch and Combine Data

Now you can use the service to fetch member details and combine them with the staff data:

```typescript
// Example usage in a controller or service

import { Injectable } from '@nestjs/common';
import { MemberMicroserviceService } from '../microservices/member-microservice/member-microservice.service';
import { ChurchMicroserviceService } from '../microservices/church-microservice/church-microservice.service';

@Injectable()
export class ChurchCampusStaffService {
    constructor(
        private readonly churchMicroservice: ChurchMicroserviceService,
        private readonly memberMicroservice: MemberMicroserviceService,
    ) {}

    async getChurchCampusStaffsWithMemberDetails(churchCampusId: string, page: number, limit: number) {
        // 1. Get the staff records
        const staffsResponse = await this.churchMicroservice.getChurchCampusStaffs(churchCampusId, page, limit);
        
        // 2. Extract member IDs from staff records
        const memberIds = staffsResponse.staffs
            .filter(staff => staff.member_id) // Filter out any null member_ids
            .map(staff => staff.member_id);
        
        if (memberIds.length === 0) {
            return staffsResponse; // No members to fetch
        }
        
        // 3. Fetch member details
        const members = await this.memberMicroservice.getMembersByIds(memberIds);
        
        // 4. Create a lookup map for quick access
        const memberMap = new Map();
        members.forEach(member => {
            memberMap.set(member.id, member);
        });
        
        // 5. Combine the data
        const enrichedStaffs = staffsResponse.staffs.map(staff => {
            const memberDetails = staff.member_id ? memberMap.get(staff.member_id) : null;
            
            return {
                ...staff,
                member: memberDetails, // Add the member details
            };
        });
        
        // 6. Return the enriched response
        return {
            ...staffsResponse,
            staffs: enrichedStaffs,
        };
    }
}
```

### Step 5: Create DTOs for Type Safety

For better type safety, create DTOs for the member data:

```typescript
// libs/libs/src/dto/member/member.dto.ts

import { IsString, IsUUID, IsEmail, IsOptional, IsDate } from 'class-validator';

export class MemberDto {
    @IsUUID()
    id: string;
    
    @IsString()
    first_name: string;
    
    @IsString()
    last_name: string;
    
    @IsEmail()
    @IsOptional()
    email?: string;
    
    @IsString()
    @IsOptional()
    phone_number?: string;
    
    // Add other member properties as needed
}
```

And update the return type in the service:

```typescript
async getMembersByIds(memberIds: string[]): Promise<MemberDto[]> {
    // ...
}
```

## Error Handling and Edge Cases

1. **Missing Member IDs**: Filter out any null or undefined member_ids before making the request.
2. **Not Found Members**: Some member IDs might not return results. Use a Map to handle this gracefully.
3. **Microservice Failures**: Wrap the microservice calls in try/catch blocks and implement proper error handling.
4. **Performance Optimization**: Consider batching requests if dealing with a large number of member IDs.

## Conclusion

This approach allows you to fetch member details from the Member microservice using a list of member IDs extracted from church campus staff records. The pattern follows the existing microservice communication structure in your application, using NestJS's ClientProxy for inter-service communication.