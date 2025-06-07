import { Entity, Index, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { ChurchCampusMember } from './church-campus-member.entity';
import { ContactInfo } from './contact-info.entity';
import { SocialInfo } from './social-infos.entity';
import { ConsolidateMember } from './consolidate-member.entity';
import { MemberDevotional } from './member-devotional.entity';
import { MemberAddress } from './member-address.entity';
import { GenderEnum } from '../model/gender-enum';
import { AffliationEnum } from '../model/affliation-enum';
import { CivilStatus } from '../model/civil-status.enum';

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

    @Column({ type: 'varchar', length: 255, nullable: true })
    photo_url: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    first_name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    last_name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ type: 'timestamptz', nullable: true })
    birthdate: Date;

    @Column({ type: 'enum', enum: GenderEnum, nullable: true })
    gender: GenderEnum;

    @Column({ type: 'enum', enum: AffliationEnum, nullable: true })
    affliation: AffliationEnum;

    @Column({ type: 'enum', enum: AffliationEnum, nullable: true })
    civil_status: CivilStatus;

    @Index()  // Create an index on invited_by
    @Column({ type: 'uuid', name: 'invited_by', nullable: true })
    invited_by: string;

    @OneToMany(() => ChurchCampusMember, churchCampusMember => churchCampusMember.member)
    church_campus_members: ChurchCampusMember[];

    @OneToMany(() => MemberAddress, memberAddress=> memberAddress.member ,{ cascade: ['insert', 'update'] })
    member_addresses: MemberAddress[];

    @OneToMany(() => ContactInfo, contactInfo => contactInfo.member,{ cascade: ['insert', 'update'] })
    contact_infos: ContactInfo[];  

    @OneToMany(() => SocialInfo, socialInfo => socialInfo.member,{ cascade: ['insert', 'update'] })
    social_infos: SocialInfo[];

    @OneToMany(() => ConsolidateMember, consolidateMember => consolidateMember.consolidator)
    consolidator_members: ConsolidateMember[];

    @OneToMany(() => ConsolidateMember, consolidateMember => consolidateMember.consolidatee)
    consolidatee_members: ConsolidateMember[];

    @OneToMany(() => MemberDevotional, memberDevotional => memberDevotional.member)
    member_devotionals: MemberDevotional[];
}