import { MigrationInterface, QueryRunner } from "typeorm";

export class ChurchMigrationName1745058086475 implements MigrationInterface {
    name = 'ChurchMigrationName1745058086475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "church_campus" ADD "established_date" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "church_campus" DROP COLUMN "established_date"`);
    }

}
