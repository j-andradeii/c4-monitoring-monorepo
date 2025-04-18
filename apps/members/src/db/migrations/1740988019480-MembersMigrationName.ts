import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1740988019480 implements MigrationInterface {
    name = 'MembersMigrationName1740988019480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consolidate_member" DROP CONSTRAINT "FK_00fded4fd14a0cf6011717ec3ed"`);
        await queryRunner.query(`ALTER TABLE "consolidate_member" DROP CONSTRAINT "FK_b24457d5b1401e8bd47dbe145f5"`);
        await queryRunner.query(`ALTER TABLE "consolidate_member" ALTER COLUMN "consolidator_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consolidate_member" ALTER COLUMN "consolidatee_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consolidate_member" ADD CONSTRAINT "FK_00fded4fd14a0cf6011717ec3ed" FOREIGN KEY ("consolidator_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consolidate_member" ADD CONSTRAINT "FK_b24457d5b1401e8bd47dbe145f5" FOREIGN KEY ("consolidatee_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consolidate_member" DROP CONSTRAINT "FK_b24457d5b1401e8bd47dbe145f5"`);
        await queryRunner.query(`ALTER TABLE "consolidate_member" DROP CONSTRAINT "FK_00fded4fd14a0cf6011717ec3ed"`);
        await queryRunner.query(`ALTER TABLE "consolidate_member" ALTER COLUMN "consolidatee_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consolidate_member" ALTER COLUMN "consolidator_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consolidate_member" ADD CONSTRAINT "FK_b24457d5b1401e8bd47dbe145f5" FOREIGN KEY ("consolidatee_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consolidate_member" ADD CONSTRAINT "FK_00fded4fd14a0cf6011717ec3ed" FOREIGN KEY ("consolidator_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
