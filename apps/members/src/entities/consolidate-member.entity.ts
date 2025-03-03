import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member.entity";
import { ChangeTrack } from "./change-track.entity";

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class ConsolidateMember {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    /**
     * This defines a Many-to-One relationship between ContactInfo and Member entities.
     * - Many ContactInfo records can belong to one Member
     * - The inverse side is defined in the Member entity as 'contact_infos'
     * - {cascade: true} means operations on ContactInfo will cascade to the related Member
     * - {eager: true} means the Member will be automatically loaded when ContactInfo is retrieved
     */
    @ManyToOne(() => Member, member => member.consolidator_members, {cascade: true, eager: true, nullable: false})
    @JoinColumn({ name: 'consolidator_id' })
    consolidator: Member;

    @ManyToOne(() => Member, member => member.consolidatee_members, {cascade: true, eager: true, nullable: false})
    @JoinColumn({ name: 'consolidatee_id' })
    consolidatee: Member;

    @Index()  // Create an index on church_campus_id
    @Column({ type: 'uuid', name: 'church_campus_id', nullable: false })
    church_campus_id: string;

    @Column({ type: 'boolean', default: false })
    promoted_as_disciple: boolean;

    @Column({ type: 'timestamptz', name: 'promoted_as_disciple_on', nullable: true })
    promoted_as_disciple_on: Date;

    @OneToMany(() => ChangeTrack, changeTrack => changeTrack.consolidate_member)
    change_tracks: ChangeTrack[];

}