import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthMigrationName1747212408290 implements MigrationInterface {
    name = 'AuthMigrationName1747212408290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying, "password" character varying(255) NOT NULL, CONSTRAINT "UQ_b54f616411ef3824f6a5c06ea46" UNIQUE ("email"), CONSTRAINT "UQ_366ebf23d8f3781bb7bb37abbd1" UNIQUE ("username"), CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b54f616411ef3824f6a5c06ea4" ON "auth" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_366ebf23d8f3781bb7bb37abbd" ON "auth" ("username") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7e416cf6172bc5aec04244f645" ON "auth" ("id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_7e416cf6172bc5aec04244f645"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_366ebf23d8f3781bb7bb37abbd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b54f616411ef3824f6a5c06ea4"`);
        await queryRunner.query(`DROP TABLE "auth"`);
    }

}
