import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1749200341654 implements MigrationInterface {
    name = 'MembersMigrationName1749200341654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" ADD "photo_url" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "photo_url"`);
    }

}
