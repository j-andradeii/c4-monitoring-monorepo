import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChurchCampus } from './church-campus.entity';

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class ChurchCampusAddress {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ChurchCampus, churchCampus => churchCampus.church_campus_addresses)  // Many-to-one relationship with Order
    @JoinColumn({ name: 'church_id' })  // Foreign key column for order_id
    churchCampus: ChurchCampus;

    @Column({ type: 'varchar', length: 255, nullable: false })
    location_name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    street: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    city: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    state: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    zip_code: string;
}