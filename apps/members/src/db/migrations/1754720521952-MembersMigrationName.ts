import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1754720521952 implements MigrationInterface {
    name = 'MembersMigrationName1754720521952'

    public async up(queryRunner: QueryRunner): Promise<void> {
       

        await queryRunner.query(`
              UPDATE "member" 
              SET "gender" = 'FEMALE'
              WHERE "id" = '5e4baa99-6d9e-4732-97db-2780ecd3c344'
        `);

 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
          // Revert back to 'MALE' if needed
          await queryRunner.query(`
              UPDATE "member"
              SET "gender" = ''
              WHERE "id" IN ('5e4baa99-6d9e-4732-97db-2780ecd3c344')
          `);
    }

}
