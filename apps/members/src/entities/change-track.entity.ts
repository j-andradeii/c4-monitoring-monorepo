import { Entity, Index, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ConsolidateMember } from "./consolidate-member.entity";
import { ChangeTrackProgress } from "./change-track-progress.entity";

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class ChangeTrack {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column({ type: 'timestamptz', name: 'schedule', nullable: true })
    schedule: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    venue: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    timezone: string;

    /**
     * This defines a Many-to-One relationship between ContactInfo and Member entities.
     * - Many ContactInfo records can belong to one Member
     * - The inverse side is defined in the Member entity as 'contact_infos'
     * - {cascade: true} means operations on ContactInfo will cascade to the related Member
     * - {eager: true} means the Member will be automatically loaded when ContactInfo is retrieved
    */
    @ManyToOne(() => ConsolidateMember, consolidateMember => consolidateMember.change_tracks, {cascade: true, eager: true})
    @JoinColumn({ name: 'consolidate_member_id' })
    consolidate_member: ConsolidateMember;

    @OneToMany(() => ChangeTrackProgress, changeTrackProgress => changeTrackProgress.change_track)
    change_track_progress: ChangeTrackProgress[];


}