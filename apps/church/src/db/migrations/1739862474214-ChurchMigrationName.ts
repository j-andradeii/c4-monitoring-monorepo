import { MigrationInterface, QueryRunner } from "typeorm";

export class ChurchMigrationName1739862474214 implements MigrationInterface {
    name = 'ChurchMigrationName1739862474214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "church" ALTER COLUMN "created_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "church" ALTER COLUMN "created_at" DROP DEFAULT`);
    }

}
