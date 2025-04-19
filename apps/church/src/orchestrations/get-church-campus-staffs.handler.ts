import { ChurchCampusStaffDto } from "@app/libs/dto/church/chuch-campus-staff.dto";
import { GetChuchCampusStaffsQuery } from "../cqrs/queries/get-church-campus-staffs.query";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DataSource } from "typeorm";
import { ChurchCampusStaffRepository } from "../repositories/church-campus-staff.repositories";

@QueryHandler(GetChuchCampusStaffsQuery)
export class GetChuchCampusStaffsHandler extends AbstractOrchestrator<any, ChurchCampusStaffDto[]> implements IQueryHandler<GetChuchCampusStaffsQuery> {


    constructor(protected readonly dataSource: DataSource,
                private readonly churchCampusStaffRepository: ChurchCampusStaffRepository) {
        super(dataSource);
    }
   
    execute(query: GetChuchCampusStaffsQuery): Promise<any> {
        return this.orchestrate({
            church_campus_id: query.id,
            paginationDto: query.paginationDto
        });
    }
  
    protected async preProcess(request: any): Promise<string> {
        return request;
    }

    protected async doProcess(request: any):  Promise<any>{
      try {
        const churchStaffsResponse = await this.churchCampusStaffRepository.findAll(request.church_campus_id, request.paginationDto);
        return churchStaffsResponse;
      } catch(error) {
        throw error;
      }
    }

    protected async postProcess(data: ChurchCampusStaffDto[]): Promise<ChurchCampusStaffDto[]> {
        return data;
    }
   

}
  