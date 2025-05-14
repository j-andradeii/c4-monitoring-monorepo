import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMemberByAuthIdQuery } from "../cqrs/queries/get-member-by-auth-id.query";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { DataSource } from "typeorm";
import { MemberRepository } from "../repositories/member-repositories";
import { ChurchCampusMemberRepository } from "../repositories/church-campus-member.repositories";

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
        console.log("requesat", request);
        const member = await this.memberRepository.findByAuthId(request);
        const churchCampusMember = await this.churchCampusMemberRepository.findChurchCampusMemberById(member.id);
        return {
            member_id: member.id,
            church_campus_id: churchCampusMember.church_campus_id
        }

    }
    protected postProcess(data: any): Promise<any> {
        return data;
    }

}