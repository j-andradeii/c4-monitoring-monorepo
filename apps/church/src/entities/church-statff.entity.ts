import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Church } from './church.entity';
import { ChurchRole } from '../model/church-role.enum';

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class ChurchStaff {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()  // Create an index on invited_by
    @Column({ type: 'uuid', name: 'member_id', nullable: true })
    member_id: string;

    @Column({ type: 'enum', enum: ChurchRole, default: ChurchRole.PASTOR })
    role: ChurchRole;   

    @ManyToOne(() => Church, church => church.church_staffs)  // Many-to-one relationship with Order
    @JoinColumn({ name: 'church_id' })  // Foreign key column for order_id
    church: Church;

}