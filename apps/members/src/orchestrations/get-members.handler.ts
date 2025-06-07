import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMembersQuery } from "../cqrs/queries/get-members-query";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { DataSource } from "typeorm";
import { MemberRepository } from "../repositories/member-repositories";
import { PaginationDto } from "@app/libs";

@QueryHandler(GetMembersQuery)
export class GetMembersHandler extends AbstractOrchestrator<any, any> implements IQueryHandler<GetMembersQuery> {


    constructor(protected readonly dataSource: DataSource,
                private memberRepository: MemberRepository) {
                    super(dataSource);
    }
    execute(query: GetMembersQuery): Promise<any> {
        return this.orchestrate(query.queryParams);
    }

    protected async preProcess(request: any): Promise<any> {
        return request;
    }
    protected async doProcess(request: any): Promise<any> {
        const paginationDto: PaginationDto = {
            limit: 10,
            page: 1,
        }
        const membersResponse = await this.memberRepository.findAll(paginationDto);


        console.log(membersResponse)
        return membersResponse
    }
    protected async postProcess(data: any): Promise<any> {
        return data;
    }


}
