import { MigrationInterface, QueryRunner } from "typeorm";

export class ChurchMigrationName1738235177056 implements MigrationInterface {
    name = 'ChurchMigrationName1738235177056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "church" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, CONSTRAINT "PK_b78b04d4dce07ba40672ef148ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b78b04d4dce07ba40672ef148a" ON "church" ("id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b78b04d4dce07ba40672ef148a"`);
        await queryRunner.query(`DROP TABLE "church"`);
    }

}
