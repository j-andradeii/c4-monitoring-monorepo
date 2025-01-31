import { MigrationInterface, QueryRunner } from "typeorm";

export class ChurchMigrationName1738291172078 implements MigrationInterface {
    name = 'ChurchMigrationName1738291172078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."church_campus_church_campus_type_enum" AS ENUM('MAIN', 'BRANCH')`);
        await queryRunner.query(`ALTER TABLE "church_campus" ADD "church_campus_type" "public"."church_campus_church_campus_type_enum" NOT NULL DEFAULT 'MAIN'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "church_campus" DROP COLUMN "church_campus_type"`);
        await queryRunner.query(`DROP TYPE "public"."church_campus_church_campus_type_enum"`);
    }

}
