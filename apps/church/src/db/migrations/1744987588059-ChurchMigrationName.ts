import { MigrationInterface, QueryRunner } from "typeorm";

export class ChurchMigrationName1744987588059 implements MigrationInterface {
    name = 'ChurchMigrationName1744987588059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "church_campus_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "location_name" character varying(255) NOT NULL, "street" character varying(255) NOT NULL, "city" character varying(255) NOT NULL, "state" character varying(255) NOT NULL, "zip_code" character varying(255) NOT NULL, "church_id" uuid, CONSTRAINT "PK_641a32315d47618c93f6367e8d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_641a32315d47618c93f6367e8d" ON "church_campus_address" ("id") `);
        await queryRunner.query(`ALTER TABLE "church_campus_address" ADD CONSTRAINT "FK_fabbcb7575bc996fa5ed63d8a32" FOREIGN KEY ("church_id") REFERENCES "church_campus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "church_campus_address" DROP CONSTRAINT "FK_fabbcb7575bc996fa5ed63d8a32"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_641a32315d47618c93f6367e8d"`);
        await queryRunner.query(`DROP TABLE "church_campus_address"`);
    }

}
