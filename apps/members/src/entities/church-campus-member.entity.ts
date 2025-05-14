import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './member.entity';
import { GenericStatusEnum } from '../model/generic-status';

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class ChurchCampusMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ManyToOne(() => Member, member => member.church_campus_members)  // Many-to-one relationship with Order
    @JoinColumn({ name: 'member_id' })  // Foreign key column for order_id
    member: Member;

    @Index()  // Create an index on church_campus_id
    @Column({ type: 'uuid', name: 'church_campus_id', nullable: false })
    church_campus_id: string;


    @Column({ type: 'enum', enum: GenericStatusEnum, default: GenericStatusEnum.ACTIVE })
    status: GenericStatusEnum;

}
