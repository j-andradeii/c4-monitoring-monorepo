import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Church } from './church.entity';

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class ChurchCampus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()  // Create an index on reference_id
    @Column({ name: 'reference_id' })
    reference_id: string;

    @ManyToOne(() => Church, church => church.church_campuses)  // Many-to-one relationship with Order
    @JoinColumn({ name: 'church_id' })  // Foreign key column for order_id
    church: Church;
}
