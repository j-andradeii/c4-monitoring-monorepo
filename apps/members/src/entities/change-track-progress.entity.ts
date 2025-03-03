import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ConsolidateMember } from "./consolidate-member.entity";
import { ChangeTrack } from "./change-track.entity";

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class ChangeTrackProgress {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamptz', name: 'session_date_time_done', nullable: false })
    session_date_time_done: Date;

    @Column({ type: 'text', nullable: true })
    progress_report: string;


    @Column({ type: 'varchar', length: 255, nullable: false })
    timezone: string;

    /**
     * This defines a Many-to-One relationship between ContactInfo and Member entities.
     * - Many ContactInfo records can belong to one Member
     * - The inverse side is defined in the Member entity as 'contact_infos'
     * - {cascade: true} means operations on ContactInfo will cascade to the related Member
     * - {eager: true} means the Member will be automatically loaded when ContactInfo is retrieved
    */
    @ManyToOne(() => ChangeTrack, changeTrack => changeTrack.change_track_progress, {cascade: true, eager: true})
    @JoinColumn({ name: 'consolidate_member_id' })
    change_track: ChangeTrack;



}