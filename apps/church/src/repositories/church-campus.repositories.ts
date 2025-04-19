import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ChurchCampus } from "../entities/church-campus.entity";

@Injectable()
export class ChurchCampussesRepository {
    constructor(@InjectRepository(ChurchCampus)private readonly churchCampussesRepository: Repository<ChurchCampus>) {
    }

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
            .leftJoinAndSelect('churchCampus.church_campus_addresses', 'church_campus_addresses')
            // .leftJoinAndSelect('churchCampus.staff', 'staff')
            .where('churchCampus.id = :id', { id })
            .getOne();
    }
}