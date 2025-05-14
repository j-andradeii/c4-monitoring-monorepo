import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthMigrationName1747212580526 implements MigrationInterface {
    name = 'AuthMigrationName1747212580526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO "auth" ("id", "email", "password") VALUES ('123e4567-e89b-12d3-a456-426614174000', 'joseph_andrade@outlook.ph', '$2b$10$iAWvnkPaq8NpO3sU1l2Ekure42gqYKX0GD/B7NKppPctGdIwgBB56')`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "auth" WHERE "id" = '123e4567-e89b-12d3-a456-426614174000'`
        );
    }

}
