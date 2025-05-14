import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetChurchCampusStaffByMemberId } from "../cqrs/queries/get-church-campus-staff-by-member-id.query";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { DataSource } from "typeorm";
import { ChurchCampusStaffRepository } from "../repositories/church-campus-staff.repositories";

@QueryHandler(GetChurchCampusStaffByMemberId)
export class GetChurchCampusStaffByMemberIdHandler extends AbstractOrchestrator<string, any> implements IQueryHandler<GetChurchCampusStaffByMemberId> {
    
    constructor(protected readonly dataSource: DataSource,
                private readonly churchCampusStaffRepository: ChurchCampusStaffRepository) {
        super(dataSource);
    }
    
    execute(query: GetChurchCampusStaffByMemberId): Promise<any> {
        return this.orchestrate(query.member_id);
    }

    protected async preProcess(request: string): Promise<string> {
        return await request;
    }

    protected async doProcess(request: string): Promise<any> {
        try {
            return this.churchCampusStaffRepository.findByMemberId(request);
          } catch(error) {
            throw error;
          }
    }

    protected async postProcess(data: any): Promise<any> {
        return await data;
    }
}