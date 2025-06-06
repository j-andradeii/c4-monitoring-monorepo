import { Entity, Index, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { ChurchCampusMember } from './church-campus-member.entity';
import { ContactInfo } from './contact-info.entity';
import { SocialInfo } from './social-infos.entity';
import { ConsolidateMember } from './consolidate-member.entity';
import { MemberDevotional } from './member-devotional.entity';
import { MemberAddress } from './member-address.entity';

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class Member {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()  // Create an index on church_id
    @Column({ type: 'uuid', name: 'church_id', nullable: false })
    church_id: string;

    @Index()  // Create an index on church_id
    @Column({ type: 'uuid', name: 'auth_id', nullable: true })
    auth_id: string;

    @Index()  // Create an index on church_id
    @Column({ type: 'uuid', name: 'church_campus_id', nullable: true })
    church_campus_id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    first_name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    last_name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ type: 'timestamptz', nullable: true })
    birthdate: Date;

    @Index()  // Create an index on invited_by
    @Column({ type: 'uuid', name: 'invited_by', nullable: true })
    invited_by: string;

    @OneToMany(() => ChurchCampusMember, churchCampusMember => churchCampusMember.member)
    church_campus_members: ChurchCampusMember[];

    @OneToMany(() => MemberAddress, memberAddress=> memberAddress.member)
    member_addresses: MemberAddress[];

    @OneToMany(() => ContactInfo, contactInfo => contactInfo.member)
    contact_infos: ContactInfo[];  

    @OneToMany(() => SocialInfo, socialInfo => socialInfo.member)
    social_infos: SocialInfo[];

    @OneToMany(() => ConsolidateMember, consolidateMember => consolidateMember.consolidator)
    consolidator_members: ConsolidateMember[];

    @OneToMany(() => ConsolidateMember, consolidateMember => consolidateMember.consolidatee)
    consolidatee_members: ConsolidateMember[];

    @OneToMany(() => MemberDevotional, memberDevotional => memberDevotional.member)
    member_devotionals: MemberDevotional[];
}