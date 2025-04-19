import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetChurchCampusByIdQuery } from "../cqrs/queries/get-church-campus-by-id-query";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { DataSource } from "typeorm";
import { ChurchesRepository } from "../repositories/churches-repositories";
import { ChurchCampussesRepository } from "../repositories/church-campus.repositories";
import { BadRequestException } from "@nestjs/common";
import { ChurchCampusDto } from "@app/libs/dto/church/church-campus.dto";
import { ChurchCampus } from "../entities/church-campus.entity";

@QueryHandler(GetChurchCampusByIdQuery)
export class GetChurchCampusByIdHandler extends AbstractOrchestrator<string, ChurchCampusDto> implements IQueryHandler<GetChurchCampusByIdQuery> {
  
    constructor(protected readonly dataSource: DataSource,
                private readonly churchCampussesRepository: ChurchCampussesRepository) {
        super(dataSource);
    }
    
    execute(query: GetChurchCampusByIdQuery): Promise<ChurchCampusDto> {
        return this.orchestrate(query.id);
    }

    protected async preProcess(request: string): Promise<string> {
        return await request;
    }
    protected async doProcess(request: string): Promise<ChurchCampusDto> {
        const churchCampus = await this.churchCampussesRepository.findOneWithRelations(request);
        const churchCampusDto = new ChurchCampusDto();
        churchCampusDto.addresses = churchCampus.church_campus_addresses;
        churchCampusDto.id = churchCampus.id;
        churchCampusDto.church = churchCampus.church;
        churchCampusDto.description = churchCampus.description;
        churchCampusDto.reference_id = churchCampus.reference_id;
        churchCampusDto.tag_line = churchCampus.tag_line;
        churchCampusDto.church_campus_type = churchCampus.church_campus_type;
        return await churchCampusDto;
    }
    protected async postProcess(data: ChurchCampusDto): Promise<ChurchCampusDto> {
        return await data;
    }

}