import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "../entities/member.entity";
import { In, Repository } from "typeorm";

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
        console.log(auth_id);
        return this.memberRepository.findOne({
            where: {auth_id: auth_id}
        })
    }
}