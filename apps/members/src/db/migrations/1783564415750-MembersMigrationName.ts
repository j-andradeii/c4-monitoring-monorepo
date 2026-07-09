import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1783564415750 implements MigrationInterface {
    name = 'MembersMigrationName1783564415750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "suynil_track_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "session_date_time_done" TIMESTAMP WITH TIME ZONE NOT NULL, "progress_report" text, "timezone" character varying(255) NOT NULL, "consolidate_member_id" uuid, CONSTRAINT "PK_83c24329af83ff98ac327b18748" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_83c24329af83ff98ac327b1874" ON "suynil_track_progress" ("id") `);
        await queryRunner.query(`CREATE TABLE "suynil_track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "schedule" TIMESTAMP WITH TIME ZONE, "venue" character varying(255), "description" text, "timezone" character varying(255) NOT NULL, "consolidate_member_id" uuid, CONSTRAINT "PK_cc1458d8db002399fc37f9e2ed4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cc1458d8db002399fc37f9e2ed" ON "suynil_track" ("id") `);
        await queryRunner.query(`ALTER TABLE "suynil_track_progress" ADD CONSTRAINT "FK_1b1e6277a99851bcb8410cb1797" FOREIGN KEY ("consolidate_member_id") REFERENCES "suynil_track"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "suynil_track" ADD CONSTRAINT "FK_500aedfe04211301bb2bb1b495d" FOREIGN KEY ("consolidate_member_id") REFERENCES "consolidate_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "suynil_track" DROP CONSTRAINT "FK_500aedfe04211301bb2bb1b495d"`);
        await queryRunner.query(`ALTER TABLE "suynil_track_progress" DROP CONSTRAINT "FK_1b1e6277a99851bcb8410cb1797"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cc1458d8db002399fc37f9e2ed"`);
        await queryRunner.query(`DROP TABLE "suynil_track"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_83c24329af83ff98ac327b1874"`);
        await queryRunner.query(`DROP TABLE "suynil_track_progress"`);
    }

}
