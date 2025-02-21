import { Injectable } from "@nestjs/common";
import { QueryRunner } from "typeorm";


@Injectable()
export class ChurchCampusClosureService {

    private readonly churchCampusTablePrefix = "church_campus_";
    private readonly churchCampusClosureTableSuffix = "_closure";

    async ensureChurchCampusClosureTable(queryRunner: QueryRunner, referenceId: string): Promise<void> {
        const tableName = `${this.churchCampusTablePrefix}${referenceId}${this.churchCampusClosureTableSuffix}`;

        try {
            // ✅ Check if the table exists within the transaction
            const checkTableExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = '${tableName}'
                );
            `);

            const tableExists = checkTableExists[0].exists || checkTableExists[0].exists === 't';

            if (!tableExists) {
                // ✅ Create table if it does not exist
                await queryRunner.query(`
                    CREATE TABLE ${tableName} (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        ancestor_id UUID NOT NULL,
                        descendant_id UUID NOT NULL,
                        depth INT NOT NULL
                    );
                `);

                // ✅ Create indexes
                await queryRunner.query(`CREATE INDEX ancestor_idx_${referenceId} ON ${tableName} (ancestor_id);`);
                await queryRunner.query(`CREATE INDEX descendant_idx_${referenceId} ON ${tableName} (descendant_id);`);
                await queryRunner.query(`CREATE INDEX depth_idx_${referenceId} ON ${tableName} (depth);`);

                console.log(`✅ Table ${tableName} created successfully.`);
            } else {
                console.log(`✅ Table ${tableName} already exists.`);
            }
        } catch (error) {
            console.error(`❌ Error in table creation:`, error);
            throw error;
        }
    }
}