import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1747213111927 implements MigrationInterface {
    name = 'MembersMigrationName1747213111927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO "member" ("id", "auth_id", "church_id", "church_campus_id", "email", "first_name", "last_name", "birthdate") VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', '123e4567-e89b-12d3-a456-426614174000', '827b5bc7-7bd6-4504-8b3d-878edd0e9478', 'e07fdc9f-1d6b-4c12-9f6b-77f90628c0bd', 'joseph_andrade@outlook.ph', 'Joseph', 'Andrade', '1992-12-22')`
        );

        // Insert into church_campus_member table
        // The 'id' for church_campus_member will be auto-generated as it's a PrimaryGeneratedColumn
        await queryRunner.query(
            `INSERT INTO "church_campus_member" ("member_id", "church_campus_id", "role") VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'e07fdc9f-1d6b-4c12-9f6b-77f90628c0bd', 'ACTIVE')`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "church_campus_member" WHERE "member_id" = 'a1b2c3d4-e5f6-7890-1234-567890abcdef' AND "church_campus_id" = 'e07fdc9f-1d6b-4c12-9f6b-77f90628c0bd'`
        );

        // Delete from member table
        await queryRunner.query(
            `DELETE FROM "member" WHERE "id" = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'`
        );
    }
}