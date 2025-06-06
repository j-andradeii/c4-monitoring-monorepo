import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1749193051138 implements MigrationInterface {
    name = 'MembersMigrationName1749193051138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "member_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying(255) NOT NULL, "city" character varying(255) NOT NULL, "state" character varying(255) NOT NULL, "zip_code" character varying(255) NOT NULL, "member_id" uuid, CONSTRAINT "PK_a4a977f9b72b362e6432ad2e9f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a4a977f9b72b362e6432ad2e9f" ON "member_address" ("id") `);
        await queryRunner.query(`ALTER TABLE "member_address" ADD CONSTRAINT "FK_68dcfd10d28767c698ff7e7ab00" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_address" DROP CONSTRAINT "FK_68dcfd10d28767c698ff7e7ab00"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a4a977f9b72b362e6432ad2e9f"`);
        await queryRunner.query(`DROP TABLE "member_address"`);
    }

}
