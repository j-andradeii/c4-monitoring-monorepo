import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChurchCampusStaff } from "../entities/church-campus-staff.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "@app/libs";

@Injectable()
export class ChurchCampusStaffRepository {
    constructor(@InjectRepository(ChurchCampusStaff)private readonly churchCampusStaffsRepository: Repository<ChurchCampusStaff>) {
    }

    async findAll(church_campus_id: string, paginationDto: PaginationDto): Promise<{ staffs: ChurchCampusStaff[], total: number }>{

        const queryBuilder = this.churchCampusStaffsRepository.createQueryBuilder('churchCampusStaffs')
        .where('churchCampusStaffs.church_campus_id = :church_campus_id', { church_campus_id });


        // .skip((paginationDto.page - 1) * paginationDto.limit)
        // .take(paginationDto.limit);

        if (paginationDto.page && paginationDto.limit) { // Or check if they are numbers
            queryBuilder
                .skip((paginationDto.page - 1) * paginationDto.limit)
                .take(paginationDto.limit);
        }

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            staffs: data,
            total
        };
    }
}