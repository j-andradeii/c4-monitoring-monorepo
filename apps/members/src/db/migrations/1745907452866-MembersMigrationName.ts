import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1745907452866 implements MigrationInterface {
    name = 'MembersMigrationName1745907452866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create closure table for church campus with reference_id 16649872
        const referenceId = 16649872;
        const tableName = `church_campus_${referenceId}_closure`;

        await queryRunner.query(`
            CREATE TABLE ${tableName} (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                ancestor_id UUID NOT NULL,
                descendant_id UUID NOT NULL,
                depth INT NOT NULL
            );
        `);

        // Create indexes
        await queryRunner.query(`CREATE INDEX ancestor_idx_${referenceId} ON ${tableName} (ancestor_id);`);
        await queryRunner.query(`CREATE INDEX descendant_idx_${referenceId} ON ${tableName} (descendant_id);`);
        await queryRunner.query(`CREATE INDEX depth_idx_${referenceId} ON ${tableName} (depth);`);

        // Insert Member data
        await queryRunner.query(`
            INSERT INTO member (id, first_name, last_name, email, birthdate, church_campus_id, church_id, invited_by)
            VALUES 
                ('5e4baa99-6d9e-4732-97db-2780ecd3c344', 'Anna Marie', 'Baloran', 'annamarie.baloran@gmail.com', '04/15/1980', 'e07fdc9f-1d6b-4c12-9f6b-77f90628c0bd', '827b5bc7-7bd6-4504-8b3d-878edd0e9478', null),
                ('e54f035d-56d9-433c-8b19-e30eeeab2e9c', 'Jimmanuel', 'Baloran', 'jimmanuel.baloran@gmail.com', '04/15/1980', 'e07fdc9f-1d6b-4c12-9f6b-77f90628c0bd', '827b5bc7-7bd6-4504-8b3d-878edd0e9478', null)
            ON CONFLICT (id) DO NOTHING;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove Member data
        await queryRunner.query(`
            DELETE FROM member 
            WHERE id IN ('5e4baa99-6d9e-4732-97db-2780ecd3c344', 'e54f035d-56d9-433c-8b19-e30eeeab2e9c');
        `);

        // Drop closure table
        const referenceId = 16649872;
        const tableName = `church_campus_${referenceId}_closure`;
        
        // Drop indexes
        await queryRunner.query(`DROP INDEX IF EXISTS ancestor_idx_${referenceId};`);
        await queryRunner.query(`DROP INDEX IF EXISTS descendant_idx_${referenceId};`);
        await queryRunner.query(`DROP INDEX IF EXISTS depth_idx_${referenceId};`);
        
        // Drop table
        await queryRunner.query(`DROP TABLE IF EXISTS ${tableName};`);
    }
}
