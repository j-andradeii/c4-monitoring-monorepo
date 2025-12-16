import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1749221655188 implements MigrationInterface {
    name = 'MembersMigrationName1749221655188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."member_gender_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`ALTER TABLE "member" ADD "gender" "public"."member_gender_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."member_gender_enum"`);
    }

}
