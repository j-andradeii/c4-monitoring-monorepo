import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1747213769194 implements MigrationInterface {
    name = 'MembersMigrationName1747213769194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "church_campus_member" RENAME COLUMN "role" TO "status"`);
        await queryRunner.query(`ALTER TYPE "public"."church_campus_member_role_enum" RENAME TO "church_campus_member_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."church_campus_member_status_enum" RENAME TO "church_campus_member_role_enum"`);
        await queryRunner.query(`ALTER TABLE "church_campus_member" RENAME COLUMN "status" TO "role"`);
    }

}
