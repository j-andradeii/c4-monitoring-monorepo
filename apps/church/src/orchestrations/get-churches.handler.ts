import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetChurchesQuery } from "../cqrs/queries/get-churches.query";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { PaginationDto } from "@app/libs";
import { DataSource } from "typeorm";
import { ChurchCampusClosureService } from "../service/church-campus-closure.service";
import { ChurchesRepository } from "../repositories/churches-repositories";

@QueryHandler(GetChurchesQuery)
export class GetChurchesHandler extends AbstractOrchestrator<PaginationDto, any> implements IQueryHandler<GetChurchesQuery> {


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