import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "../entities/member.entity";
import { In, Repository } from "typeorm";
import { PaginationDto } from "@app/libs";

@Injectable()
export class MemberRepository{
    constructor(@InjectRepository(Member)
                private readonly memberRepository: Repository<Member>) {
    }

    async findManyByIds(member_ids: string[]): Promise<Member[]> {
        return this.memberRepository.find({
            where: {id: In(member_ids)}
        })
    }

    async findByAuthId(auth_id: string): Promise<Member> {
        return this.memberRepository.findOne({
            where: {auth_id: auth_id}
        })
    }

    async findAll(paginationDto: PaginationDto): Promise<any> {
        const queryBuilder = this.memberRepository.createQueryBuilder('member')
            .leftJoinAndSelect('member.member_addresses', 'member_addresses')
        ;

        if (paginationDto.page && paginationDto.limit) { // Or check if they are numbers
            queryBuilder
                .skip((paginationDto.page - 1) * paginationDto.limit)
                .take(paginationDto.limit);
        }

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            members: data,
            total
        };
    }
}