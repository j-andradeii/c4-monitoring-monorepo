import { MigrationInterface, QueryRunner } from "typeorm";

export class ChurchMigrationName1738304437463 implements MigrationInterface {
    name = 'ChurchMigrationName1738304437463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "church_contact_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone_number" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "website" character varying(255), "church_logo" character varying(255), "church_id" uuid, CONSTRAINT "REL_5e4fbbe0d060e65293e960d1b0" UNIQUE ("church_id"), CONSTRAINT "PK_73af1cdb16014459a56336e3547" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_73af1cdb16014459a56336e354" ON "church_contact_info" ("id") `);
        await queryRunner.query(`CREATE TABLE "church_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "location_name" character varying(255) NOT NULL, "street" character varying(255) NOT NULL, "city" character varying(255) NOT NULL, "state" character varying(255) NOT NULL, "zip_code" character varying(255) NOT NULL, "church_id" uuid, CONSTRAINT "PK_1b2e67f2175cffc135175eb4021" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1b2e67f2175cffc135175eb402" ON "church_address" ("id") `);
        await queryRunner.query(`ALTER TABLE "church_contact_info" ADD CONSTRAINT "FK_5e4fbbe0d060e65293e960d1b07" FOREIGN KEY ("church_id") REFERENCES "church"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "church_address" ADD CONSTRAINT "FK_8710cd22a411e4bbeb3cf19ad53" FOREIGN KEY ("church_id") REFERENCES "church"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "church_address" DROP CONSTRAINT "FK_8710cd22a411e4bbeb3cf19ad53"`);
        await queryRunner.query(`ALTER TABLE "church_contact_info" DROP CONSTRAINT "FK_5e4fbbe0d060e65293e960d1b07"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1b2e67f2175cffc135175eb402"`);
        await queryRunner.query(`DROP TABLE "church_address"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_73af1cdb16014459a56336e354"`);
        await queryRunner.query(`DROP TABLE "church_contact_info"`);
    }

}
