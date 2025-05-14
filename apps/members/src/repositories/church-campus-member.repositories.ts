import { Injectable } from "@nestjs/common";
import { ChurchCampusMember } from "../entities/church-campus-member.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GenericStatusEnum } from "../model/generic-status";

@Injectable()
export class ChurchCampusMemberRepository{
    constructor(@InjectRepository(ChurchCampusMember)
                private readonly churchCampusMemberRepository: Repository<ChurchCampusMember>) {

    }

    async findChurchCampusMemberById(member_id: string): Promise<ChurchCampusMember> {
        return this.churchCampusMemberRepository.findOne({
            where: {member: {
                        id: member_id,
                },
                status: GenericStatusEnum.ACTIVE
            }
        });
    }
}