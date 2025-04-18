import { Entity, Index, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Member } from "./member.entity";
import { SocialMediaType } from "../enums/social-media.enum";

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class SocialInfo {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: SocialMediaType, default: SocialMediaType.FACEBOOK })
    social_media_type: SocialMediaType;

    @Column({ type: 'varchar', length: 255, nullable: false })
    username: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

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
