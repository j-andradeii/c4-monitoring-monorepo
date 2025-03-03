import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member.entity";
import { DevionalStatus } from "../enums/devotional-status.enum";

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class MemberDevotional {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()  // Create an index on church_id
    @Column({ type: 'uuid', name: 'church_id', nullable: false })
    church_id: string;

    @Index()  // Create an index on church_campus_id
    @Column({ type: 'uuid', name: 'church_campus_id', nullable: false })
    church_campus_id: string;

    @Column({ type: 'enum', enum: DevionalStatus, default: DevionalStatus.MISSED })
    devotional_status: DevionalStatus;

    @Column({ type: 'text', nullable: true })
    remarks: string;

    @Column({ type: 'timestamptz', nullable: false })
    created_at: Date;

    @Column({ type: 'varchar', length: 255, nullable: false })
    timezone: string;

    /**
     * This defines a Many-to-One relationship between ContactInfo and Member entities.
     * - Many ContactInfo records can belong to one Member
     * - The inverse side is defined in the Member entity as 'contact_infos'
     * - {cascade: true} means operations on ContactInfo will cascade to the related Member
     * - {eager: true} means the Member will be automatically loaded when ContactInfo is retrieved
    */
    @ManyToOne(() => Member, member => member.contact_infos, {cascade: true, eager: true})
    @JoinColumn({ name: 'member_id' })
    member: Member;
}