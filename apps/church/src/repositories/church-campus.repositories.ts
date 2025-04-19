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

    // Option 1: Using findOne with relations option (simplest approach)
    async findOne(id: string): Promise<ChurchCampus> {
        return await this.churchCampussesRepository.findOne({
            where: { id },
            relations: ['church'] // Add the church relation
        });
    }
    
    // Option 2: Using QueryBuilder (more flexible for complex queries)
    async findOneWithRelations(id: string): Promise<ChurchCampus> {
        return await this.churchCampussesRepository
            .createQueryBuilder('churchCampus')
            .leftJoinAndSelect('churchCampus.church', 'church')
            // You can add more relations as needed:
            // .leftJoinAndSelect('churchCampus.addresses', 'addresses')
            // .leftJoinAndSelect('churchCampus.staff', 'staff')
            .where('churchCampus.id = :id', { id })
            .getOne();
    }

}