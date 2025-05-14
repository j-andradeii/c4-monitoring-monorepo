import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1747213038686 implements MigrationInterface {
    name = 'MembersMigrationName1747213038686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" ADD "auth_id" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_385ca388edc6d1f6eaf1671568" ON "member" ("auth_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_385ca388edc6d1f6eaf1671568"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "auth_id"`);
    }

}
