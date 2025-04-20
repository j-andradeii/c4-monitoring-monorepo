import { MigrationInterface, QueryRunner } from "typeorm";

export class ChurchMigrationName1744988022628 implements MigrationInterface {
    name = 'ChurchMigrationName1744988022628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "church_campus_staff" ADD "is_hierarchy_root" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "church_campus" ADD "tag_line" character varying`);
        await queryRunner.query(`ALTER TABLE "church_campus" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "church_campus" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "church_campus" DROP COLUMN "tag_line"`);
        await queryRunner.query(`ALTER TABLE "church_campus_staff" DROP COLUMN "is_hierarchy_root"`);
    }

}
