import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1738309949245 implements MigrationInterface {
    name = 'MembersMigrationName1738309949245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."church_campus_member_role_enum" AS ENUM('ACTIVE', 'IN_ACTIVE')`);
        await queryRunner.query(`CREATE TABLE "church_campus_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "church_campus_id" uuid NOT NULL, "role" "public"."church_campus_member_role_enum" NOT NULL DEFAULT 'ACTIVE', "member_id" uuid, CONSTRAINT "PK_5ac75f7eeb81ffffd8e988c3f16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c254d4b574155dcce483845b58" ON "church_campus_member" ("church_campus_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5ac75f7eeb81ffffd8e988c3f1" ON "church_campus_member" ("id") `);
        await queryRunner.query(`ALTER TABLE "church_campus_member" ADD CONSTRAINT "FK_89abde810df9ab8478a74c46bd3" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "church_campus_member" DROP CONSTRAINT "FK_89abde810df9ab8478a74c46bd3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5ac75f7eeb81ffffd8e988c3f1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c254d4b574155dcce483845b58"`);
        await queryRunner.query(`DROP TABLE "church_campus_member"`);
        await queryRunner.query(`DROP TYPE "public"."church_campus_member_role_enum"`);
    }

}
