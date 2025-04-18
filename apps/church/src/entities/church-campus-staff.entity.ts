import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChurchRole } from '../model/church-role.enum';
import { ChurchCampus } from './church-campus.entity';

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class ChurchCampusStaff {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()  // Create an index on invited_by
    @Column({ type: 'uuid', name: 'member_id', nullable: true })
    member_id: string;

    @Column({default: false}) // TypeORM infers the database type from the TypeScript type 'boolean'
    is_hierarchy_root: boolean;

    @Column({ type: 'enum', enum: ChurchRole, default: ChurchRole.PASTOR })
    role: ChurchRole;   

    @ManyToOne(() => ChurchCampus, churchCampus => churchCampus.church_campus_staffs)  // Many-to-one relationship with Order
    @JoinColumn({ name: 'church_campus_id' })  // Foreign key column for order_id
    church_campus: ChurchCampus;
}
