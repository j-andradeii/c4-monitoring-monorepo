import { MigrationInterface, QueryRunner } from "typeorm";

export class ChurchMigrationName1745906117945 implements MigrationInterface {
    name = 'ChurchMigrationName1745906117945'


    public async up(queryRunner: QueryRunner): Promise<void> {
        // Insert Church data
        await queryRunner.query(`
            INSERT INTO church (id, name, timezone)
            VALUES ('827b5bc7-7bd6-4504-8b3d-878edd0e9478', 'Gateway Church', 'Asia/Manila')
            ON CONFLICT (id) DO NOTHING;
        `);

        // Insert ChurchCampus data
        await queryRunner.query(`
            INSERT INTO church_campus (id, church_campus_type, church_id, tag_line, reference_id)
            VALUES ('e07fdc9f-1d6b-4c12-9f6b-77f90628c0bd', 'MAIN', '827b5bc7-7bd6-4504-8b3d-878edd0e9478', 'His Precense, Our Home', 16649872)
            ON CONFLICT (id) DO NOTHING;
        `);

        // Insert ChurchCampusStaff data
        await queryRunner.query(`
            INSERT INTO church_campus_staff (id, role, is_hierarchy_root, church_campus_id, member_id)
            VALUES 
                ('81c55ba5-86f7-4bb1-b758-db1c01f66ff4', 'PASTOR', true, 'e07fdc9f-1d6b-4c12-9f6b-77f90628c0bd', 'e54f035d-56d9-433c-8b19-e30eeeab2e9c'),
                ('5f62d95d-f1d1-4ae6-8673-ba16d4bc3fa4', 'PASTOR', true, 'e07fdc9f-1d6b-4c12-9f6b-77f90628c0bd', '5e4baa99-6d9e-4732-97db-2780ecd3c344')
            ON CONFLICT (id) DO NOTHING;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove ChurchCampusStaff data
        await queryRunner.query(`
            DELETE FROM church_campus_staff 
            WHERE id IN ('81c55ba5-86f7-4bb1-b758-db1c01f66ff4', '5f62d95d-f1d1-4ae6-8673-ba16d4bc3fa4');
        `);

        // Remove ChurchCampus data
        await queryRunner.query(`
            DELETE FROM church_campus 
            WHERE id = 'e07fdc9f-1d6b-4c12-9f6b-77f90628c0bd';
        `);

        // Remove Church data
        await queryRunner.query(`
            DELETE FROM church 
            WHERE id = '827b5bc7-7bd6-4504-8b3d-878edd0e9478';
        `);
    }
}
