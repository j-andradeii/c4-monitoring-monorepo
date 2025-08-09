import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1754720131329 implements MigrationInterface {
    name = 'MembersMigrationName1754720131329'

    public async up(queryRunner: QueryRunner): Promise<void> {
       

        await queryRunner.query(`
              UPDATE "member" 
              SET "gender" = 'MALE'
              WHERE "id" = 'e54f035d-56d9-433c-8b19-e30eeeab2e9c'
        `);

        await queryRunner.query(`
              UPDATE "member" 
              SET "gender" = 'MALE'
              WHERE "id" = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
          // Revert back to 'MALE' if needed
          await queryRunner.query(`
              UPDATE "member"
              SET "gender" = 'MALE'
              WHERE "id" IN ('e54f035d-56d9-433c-8b19-e30eeeab2e9c', 'a1b2c3d4-e5f6-7890-1234-567890abcdef')
          `);
    }

}
