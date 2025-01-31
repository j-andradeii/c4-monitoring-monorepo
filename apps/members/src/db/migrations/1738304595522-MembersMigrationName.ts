import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1738304595522 implements MigrationInterface {
    name = 'MembersMigrationName1738304595522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "church_id" uuid NOT NULL, "church_campus_id" uuid, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255), "birthdate" TIMESTAMP WITH TIME ZONE, "invited_by" uuid, CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6d4f59ac9343c38e9d18c512f7" ON "member" ("church_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d66858c0da3431f05c828ee2cb" ON "member" ("church_campus_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ab0c97441a84ed5311874f0771" ON "member" ("invited_by") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97cbbe986ce9d14ca5894fdc07" ON "member" ("id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_97cbbe986ce9d14ca5894fdc07"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab0c97441a84ed5311874f0771"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d66858c0da3431f05c828ee2cb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6d4f59ac9343c38e9d18c512f7"`);
        await queryRunner.query(`DROP TABLE "member"`);
    }

}
