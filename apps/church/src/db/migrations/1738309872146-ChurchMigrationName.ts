import { MigrationInterface, QueryRunner } from "typeorm";

export class ChurchMigrationName1738309872146 implements MigrationInterface {
    name = 'ChurchMigrationName1738309872146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."church_campus_staff_role_enum" AS ENUM('STAFF', 'MEMBER', 'PASTOR', 'SENIOR_PASTOR', 'PRIMARY')`);
        await queryRunner.query(`CREATE TABLE "church_campus_staff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "member_id" uuid, "role" "public"."church_campus_staff_role_enum" NOT NULL DEFAULT 'PASTOR', "church_campus_id" uuid, CONSTRAINT "PK_37970b893e9c33cc78e30b6a880" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4185b3f4add69923290ab5198f" ON "church_campus_staff" ("member_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_37970b893e9c33cc78e30b6a88" ON "church_campus_staff" ("id") `);
        await queryRunner.query(`CREATE TYPE "public"."church_staff_role_enum" AS ENUM('STAFF', 'MEMBER', 'PASTOR', 'SENIOR_PASTOR', 'PRIMARY')`);
        await queryRunner.query(`CREATE TABLE "church_staff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "member_id" uuid, "role" "public"."church_staff_role_enum" NOT NULL DEFAULT 'PASTOR', "church_id" uuid, CONSTRAINT "PK_95c9b88a0ddc4cfad6044e47461" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_39ef2989104e4b123881e306f8" ON "church_staff" ("member_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_95c9b88a0ddc4cfad6044e4746" ON "church_staff" ("id") `);
        await queryRunner.query(`CREATE TABLE "church_closure" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ancestor_id" uuid NOT NULL, "descendant_id" uuid NOT NULL, "depth" integer NOT NULL, CONSTRAINT "PK_69f093accb9f0cb73a33f3d3166" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8e77ff0cfb204260f8a5df137e" ON "church_closure" ("ancestor_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_43a3ff78316f27b6dbcf6963c0" ON "church_closure" ("descendant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_af77f94d4a564a982c3feae6c4" ON "church_closure" ("depth") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_69f093accb9f0cb73a33f3d316" ON "church_closure" ("id") `);
        await queryRunner.query(`ALTER TABLE "church_campus_staff" ADD CONSTRAINT "FK_c00fc8c3761616ef6de67af6972" FOREIGN KEY ("church_campus_id") REFERENCES "church_campus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "church_staff" ADD CONSTRAINT "FK_2b0e2a4369e2f6292c3c62e52e0" FOREIGN KEY ("church_id") REFERENCES "church"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "church_staff" DROP CONSTRAINT "FK_2b0e2a4369e2f6292c3c62e52e0"`);
        await queryRunner.query(`ALTER TABLE "church_campus_staff" DROP CONSTRAINT "FK_c00fc8c3761616ef6de67af6972"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_69f093accb9f0cb73a33f3d316"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_af77f94d4a564a982c3feae6c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_43a3ff78316f27b6dbcf6963c0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8e77ff0cfb204260f8a5df137e"`);
        await queryRunner.query(`DROP TABLE "church_closure"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_95c9b88a0ddc4cfad6044e4746"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39ef2989104e4b123881e306f8"`);
        await queryRunner.query(`DROP TABLE "church_staff"`);
        await queryRunner.query(`DROP TYPE "public"."church_staff_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_37970b893e9c33cc78e30b6a88"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4185b3f4add69923290ab5198f"`);
        await queryRunner.query(`DROP TABLE "church_campus_staff"`);
        await queryRunner.query(`DROP TYPE "public"."church_campus_staff_role_enum"`);
    }

}
