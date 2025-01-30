import { MigrationInterface, QueryRunner } from "typeorm";

export class ChurchMigrationName1738239297406 implements MigrationInterface {
    name = 'ChurchMigrationName1738239297406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "church_campus" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reference_id" character varying NOT NULL, "church_id" uuid, CONSTRAINT "PK_e2061ef37fb6f56b69d81749436" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3c978ff8a33cede5c8014d2111" ON "church_campus" ("reference_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e2061ef37fb6f56b69d8174943" ON "church_campus" ("id") `);
        await queryRunner.query(`ALTER TABLE "church" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "church" ADD "timezone" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "church_campus" ADD CONSTRAINT "FK_58d0d099e139bd2fd09dc5a7abf" FOREIGN KEY ("church_id") REFERENCES "church"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "church_campus" DROP CONSTRAINT "FK_58d0d099e139bd2fd09dc5a7abf"`);
        await queryRunner.query(`ALTER TABLE "church" DROP COLUMN "timezone"`);
        await queryRunner.query(`ALTER TABLE "church" DROP COLUMN "created_at"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e2061ef37fb6f56b69d8174943"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3c978ff8a33cede5c8014d2111"`);
        await queryRunner.query(`DROP TABLE "church_campus"`);
    }

}
