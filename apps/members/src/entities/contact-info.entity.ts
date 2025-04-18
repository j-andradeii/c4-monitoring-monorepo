import { Entity, Index, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, ManyToOne } from "typeorm";
import { Member } from "./member.entity";
import { ContactInfoType, ContactInfoPriorityType } from "../enums/contact-info.enum";


@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class ContactInfo {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    number: string;

    @Column({ type: 'enum', enum: ContactInfoType, default: ContactInfoType.MOBILE })
    contactInfoType: ContactInfoType;

    @Column({ type: 'enum', enum: ContactInfoPriorityType, default: ContactInfoPriorityType.PRIMARY })
    priority: ContactInfoPriorityType;


    
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