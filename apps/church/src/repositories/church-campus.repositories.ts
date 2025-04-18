import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Church } from "../entities/church.entity";
import { Injectable } from "@nestjs/common";
import { PaginationDto } from "@app/libs";
import { ChurchCampus } from "../entities/church-campus.entity";

@Injectable()
export class ChurchCampussesRepository {
    constructor(@InjectRepository(ChurchCampus)private readonly churchCampussesRepository: Repository<ChurchCampus>) {

    }

    // async findAll(paginationDto: PaginationDto): Promise<{ churches: Church[], total: number }>{
    //     const queryBuilder = this.churchesRepository.createQueryBuilder('church')
    //     .skip((paginationDto.page - 1) * paginationDto.limit)
    //     .take(paginationDto.limit);

    //     const [data, total] = await queryBuilder.getManyAndCount();

    //     return {
    //         churches: data,
    //         total
    //     };

    // }

    async findOne(id: string): Promise<ChurchCampus> {
        return  await this.churchCampussesRepository.findOneBy({id})
    }

}