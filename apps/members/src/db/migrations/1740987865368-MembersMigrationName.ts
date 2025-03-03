import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersMigrationName1740987865368 implements MigrationInterface {
    name = 'MembersMigrationName1740987865368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contact_info_contactinfotype_enum" AS ENUM('PHONE', 'MOBILE')`);
        await queryRunner.query(`CREATE TYPE "public"."contact_info_priority_enum" AS ENUM('PRIMARY', 'SECONDARY')`);
        await queryRunner.query(`CREATE TABLE "contact_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" character varying(255) NOT NULL, "contactInfoType" "public"."contact_info_contactinfotype_enum" NOT NULL DEFAULT 'MOBILE', "priority" "public"."contact_info_priority_enum" NOT NULL DEFAULT 'PRIMARY', "member_id" uuid, CONSTRAINT "PK_65b98fa4ffb26dceb9192f5d496" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_65b98fa4ffb26dceb9192f5d49" ON "contact_info" ("id") `);
        await queryRunner.query(`CREATE TYPE "public"."social_info_social_media_type_enum" AS ENUM('FACEBOOK', 'TWITTER', 'LINKEDIN', 'INSTAGRAM', 'YOUTUBE', 'TIKTOK')`);
        await queryRunner.query(`CREATE TABLE "social_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "social_media_type" "public"."social_info_social_media_type_enum" NOT NULL DEFAULT 'FACEBOOK', "username" character varying(255) NOT NULL, "name" character varying(255), "email" character varying(255), "member_id" uuid, CONSTRAINT "PK_a10beb877e213738e047cf2ad00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a10beb877e213738e047cf2ad0" ON "social_info" ("id") `);
        await queryRunner.query(`CREATE TABLE "change_track_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "session_date_time_done" TIMESTAMP WITH TIME ZONE NOT NULL, "progress_report" text, "timezone" character varying(255) NOT NULL, "consolidate_member_id" uuid, CONSTRAINT "PK_ead11330148dffbeae3f3fcb689" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ead11330148dffbeae3f3fcb68" ON "change_track_progress" ("id") `);
        await queryRunner.query(`CREATE TABLE "change_track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "schedule" TIMESTAMP WITH TIME ZONE, "venue" character varying(255), "description" text, "timezone" character varying(255) NOT NULL, "consolidate_member_id" uuid, CONSTRAINT "PK_cce20d920ba86e357111c4419a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cce20d920ba86e357111c4419a" ON "change_track" ("id") `);
        await queryRunner.query(`CREATE TABLE "consolidate_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "church_campus_id" uuid NOT NULL, "promoted_as_disciple" boolean NOT NULL DEFAULT false, "promoted_as_disciple_on" TIMESTAMP WITH TIME ZONE, "consolidator_id" uuid, "consolidatee_id" uuid, CONSTRAINT "PK_d3ea0dc03e4b82f94b6f249755e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ad951c6a826553fb53885ecd8b" ON "consolidate_member" ("church_campus_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d3ea0dc03e4b82f94b6f249755" ON "consolidate_member" ("id") `);
        await queryRunner.query(`CREATE TYPE "public"."member_devotional_devotional_status_enum" AS ENUM('COMPLETE', 'NEAR_COMPLETE', 'INCONSISTENT', 'MISSED')`);
        await queryRunner.query(`CREATE TABLE "member_devotional" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "church_id" uuid NOT NULL, "church_campus_id" uuid NOT NULL, "devotional_status" "public"."member_devotional_devotional_status_enum" NOT NULL DEFAULT 'MISSED', "remarks" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "timezone" character varying(255) NOT NULL, "member_id" uuid, CONSTRAINT "PK_dfef9c477e5720fdef9215a5a23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b0aa94afbca1c0de683a11030b" ON "member_devotional" ("church_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_82ffcf51aeb17f3c0f816a5b29" ON "member_devotional" ("church_campus_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_dfef9c477e5720fdef9215a5a2" ON "member_devotional" ("id") `);
        await queryRunner.query(`ALTER TABLE "contact_info" ADD CONSTRAINT "FK_42af8fc059a4bbaa89d19ca3cca" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "social_info" ADD CONSTRAINT "FK_b904e1d4f77997d7b703045d550" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "change_track_progress" ADD CONSTRAINT "FK_5ea98f546c6abc8772a75f7c0b5" FOREIGN KEY ("consolidate_member_id") REFERENCES "change_track"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "change_track" ADD CONSTRAINT "FK_710ce7cdf645dea9f491b3377e2" FOREIGN KEY ("consolidate_member_id") REFERENCES "consolidate_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consolidate_member" ADD CONSTRAINT "FK_00fded4fd14a0cf6011717ec3ed" FOREIGN KEY ("consolidator_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consolidate_member" ADD CONSTRAINT "FK_b24457d5b1401e8bd47dbe145f5" FOREIGN KEY ("consolidatee_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_devotional" ADD CONSTRAINT "FK_2ded996910556537d50e0344efd" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_devotional" DROP CONSTRAINT "FK_2ded996910556537d50e0344efd"`);
        await queryRunner.query(`ALTER TABLE "consolidate_member" DROP CONSTRAINT "FK_b24457d5b1401e8bd47dbe145f5"`);
        await queryRunner.query(`ALTER TABLE "consolidate_member" DROP CONSTRAINT "FK_00fded4fd14a0cf6011717ec3ed"`);
        await queryRunner.query(`ALTER TABLE "change_track" DROP CONSTRAINT "FK_710ce7cdf645dea9f491b3377e2"`);
        await queryRunner.query(`ALTER TABLE "change_track_progress" DROP CONSTRAINT "FK_5ea98f546c6abc8772a75f7c0b5"`);
        await queryRunner.query(`ALTER TABLE "social_info" DROP CONSTRAINT "FK_b904e1d4f77997d7b703045d550"`);
        await queryRunner.query(`ALTER TABLE "contact_info" DROP CONSTRAINT "FK_42af8fc059a4bbaa89d19ca3cca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dfef9c477e5720fdef9215a5a2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_82ffcf51aeb17f3c0f816a5b29"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b0aa94afbca1c0de683a11030b"`);
        await queryRunner.query(`DROP TABLE "member_devotional"`);
        await queryRunner.query(`DROP TYPE "public"."member_devotional_devotional_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3ea0dc03e4b82f94b6f249755"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad951c6a826553fb53885ecd8b"`);
        await queryRunner.query(`DROP TABLE "consolidate_member"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cce20d920ba86e357111c4419a"`);
        await queryRunner.query(`DROP TABLE "change_track"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ead11330148dffbeae3f3fcb68"`);
        await queryRunner.query(`DROP TABLE "change_track_progress"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a10beb877e213738e047cf2ad0"`);
        await queryRunner.query(`DROP TABLE "social_info"`);
        await queryRunner.query(`DROP TYPE "public"."social_info_social_media_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_65b98fa4ffb26dceb9192f5d49"`);
        await queryRunner.query(`DROP TABLE "contact_info"`);
        await queryRunner.query(`DROP TYPE "public"."contact_info_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."contact_info_contactinfotype_enum"`);
    }

}
