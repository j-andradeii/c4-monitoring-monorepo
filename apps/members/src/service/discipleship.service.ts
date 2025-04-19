import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "../entities/member.entity";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { CONST } from "../core/constants";
import { MemberRepository } from "../repositories/member-repositories";

@Injectable()
export class DiscipleshipService {
    private readonly logger = new Logger(DiscipleshipService.name);
    
    constructor(private memberRepository: MemberRepository ) {
    }

    getChurchCampusClosureTableName(refrence_id: string): string {
        return `${CONST.churchCampusTablePrefix}${refrence_id}${CONST.churchCampusClosureTableSuffix}`;
    }

    quote(identifier: string): string {
        return `"${identifier.replace(/"/g, '""')}"`;
    }

    async addRootDisciple(queryRunner: QueryRunner, member_id: string, reference_id: string) {
        const closureTable = this.quote(this.getChurchCampusClosureTableName(reference_id));
        this.logger.log(`Starting transaction to add root disciple '${member_id}' (Closure Table: ${closureTable})`);

        try {
            // 1. Validate member exists in the main 'members' table
            const memberExists = await queryRunner.manager.exists(Member, { where: { id: member_id } });
            if (!memberExists) {
                throw new NotFoundException(`Member with ID ${member_id} not found.`);
            }

            // 2. Check if the member already has a self-reference in this closure table
            const selfExists = await queryRunner.query(
                `SELECT 1 FROM ${closureTable} WHERE ancestor_id = $1 AND descendant_id = $1 LIMIT 1`,
                [member_id]
            );

            // 3. If self-reference doesn't exist, insert it.
            if (selfExists.length === 0) {
                await queryRunner.query(
                    `INSERT INTO ${closureTable} (ancestor_id, descendant_id, depth) VALUES ($1, $1, 0)`,
                        [member_id]
                );
                this.logger.debug(`Inserted self-closure for root disciple ${member_id} into ${closureTable}`);
            } else {
                this.logger.warn(`Member ${member_id} already exists in closure table ${closureTable}. No action taken.`);
            }
        } catch(error) {
            throw error;
        }
    }
}