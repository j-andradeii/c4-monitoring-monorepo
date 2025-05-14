import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMemberByAuthIdQuery } from "../cqrs/queries/get-member-by-auth-id.query";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { DataSource } from "typeorm";
import { MemberRepository } from "../repositories/member-repositories";
import { ChurchCampusMemberRepository } from "../repositories/church-campus-member.repositories";
import { MemberDto } from "@app/libs";
import { NotFoundException } from "@nestjs/common";

@QueryHandler(GetMemberByAuthIdQuery)
export class GetMemberByAUthIdHandler extends AbstractOrchestrator<string, any> implements IQueryHandler<GetMemberByAuthIdQuery> {

    constructor(protected readonly dataSource: DataSource,
                private memberRepository: MemberRepository,
                private churchCampusMemberRepository: ChurchCampusMemberRepository) {
                    super(dataSource);
    }
    
    execute(query: GetMemberByAuthIdQuery): Promise<any> {
        return this.orchestrate(query.auth_id);
    }

    protected async preProcess(request: string): Promise<string> {
        return request;
    }
    protected async doProcess(request: string): Promise<any> {
        const member = await this.memberRepository.findByAuthId(request);
        const churchCampusMember = await this.churchCampusMemberRepository.findChurchCampusMemberById(member.id);
        
        if(!churchCampusMember) {
            throw new NotFoundException("No active church campus associated to member");
        }
        
        return {
            member: member as MemberDto,
        }

    }
    protected postProcess(data: any): Promise<any> {
        return data;
    }

}