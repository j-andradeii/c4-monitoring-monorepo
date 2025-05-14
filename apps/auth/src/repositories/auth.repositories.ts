import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Auth } from "../entities/auth.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AuthRepository {
    constructor(@InjectRepository(Auth)private readonly authRepository: Repository<Auth>) { }

    public async findUserByEmail(email: string): Promise<Auth> {
        return await this.authRepository.findOne({
            where: { email: email }
        });
    }

}