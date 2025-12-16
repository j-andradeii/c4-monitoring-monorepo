import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1749273874571 implements MigrationInterface {
    name = 'MembersMigrationName1749273874571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_address" ALTER COLUMN "state" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member_address" ALTER COLUMN "zip_code" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_address" ALTER COLUMN "zip_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member_address" ALTER COLUMN "state" SET NOT NULL`);
    }

}
