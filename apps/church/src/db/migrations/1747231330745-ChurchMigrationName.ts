import { MigrationInterface, QueryRunner } from "typeorm";

export class ChurchMigrationName1747231330745 implements MigrationInterface {
    name = 'ChurchMigrationName1747231330745'


    public async up(queryRunner: QueryRunner): Promise<void> {

        // Insert ChurchCampusStaff data
        await queryRunner.query(`
            INSERT INTO church_campus_staff (id, role, is_hierarchy_root, church_campus_id, member_id)
            VALUES 
                ('1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', 'STAFF', false, 'e07fdc9f-1d6b-4c12-9f6b-77f90628c0bd', 'a1b2c3d4-e5f6-7890-1234-567890abcdef')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "church_campus_staff" WHERE "id" = '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'`
        );
    }

}