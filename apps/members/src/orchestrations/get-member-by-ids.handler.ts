import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMembersByIdsQuery } from "../cqrs/queries/get-members-by-ids-query";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { MemberRepository } from "../repositories/member-repositories";
import { DataSource } from "typeorm";
import { Member } from "../entities/member.entity";

@QueryHandler(GetMembersByIdsQuery)
export class GetMembersByIdsHandler extends AbstractOrchestrator<string[], any> implements IQueryHandler<GetMembersByIdsQuery> {

    constructor(protected readonly dataSource: DataSource,
                private memberRepository: MemberRepository) {
                    super(dataSource);
    }


    async execute(query: GetMembersByIdsQuery): Promise<any> {
        return this.orchestrate(query.member_ids);
    }

    protected async preProcess(request: string[]): Promise<string[]> {
        return request;
    }

    protected doProcess(request: string[]): Promise<Member[]> {
        return this.memberRepository.findManyByIds(request);
    }

    protected postProcess(data:  Promise<Member[]>): Promise<Member[]> {
        return data;
    }

}