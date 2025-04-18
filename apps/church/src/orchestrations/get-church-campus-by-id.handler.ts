import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetChurchCampusByIdQuery } from "../cqrs/queries/get-church-campus-by-id-query";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { DataSource } from "typeorm";
import { ChurchesRepository } from "../repositories/churches-repositories";
import { ChurchCampussesRepository } from "../repositories/church-campus.repositories";

@QueryHandler(GetChurchCampusByIdQuery)
export class GetChurchCampusByIdHandler extends AbstractOrchestrator<string, any> implements IQueryHandler<GetChurchCampusByIdQuery> {
  
    constructor(protected readonly dataSource: DataSource,
                private readonly churchCampussesRepository: ChurchCampussesRepository) {
        super(dataSource);
    }
    

    execute(query: GetChurchCampusByIdQuery): Promise<any> {
        return this.orchestrate(query.id);
    }

    protected async preProcess(request: string): Promise<string> {
        return await request;
    }
    protected async doProcess(request: string): Promise<any> {
        const churches = await this.churchCampussesRepository.findOne(request);
        return await churches;
    }
    protected async postProcess(data: any): Promise<any> {
        return await data;
    }

}