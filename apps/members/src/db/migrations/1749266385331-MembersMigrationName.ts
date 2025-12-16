import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1749266385331 implements MigrationInterface {
    name = 'MembersMigrationName1749266385331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."member_affliation_enum" AS ENUM('STUDENT', 'YOUNG_PRO', 'BUSINESS')`);
        await queryRunner.query(`ALTER TABLE "member" ADD "affliation" "public"."member_affliation_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."member_civil_status_enum" AS ENUM('STUDENT', 'YOUNG_PRO', 'BUSINESS')`);
        await queryRunner.query(`ALTER TABLE "member" ADD "civil_status" "public"."member_civil_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "civil_status"`);
        await queryRunner.query(`DROP TYPE "public"."member_civil_status_enum"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "affliation"`);
        await queryRunner.query(`DROP TYPE "public"."member_affliation_enum"`);
    }

}
