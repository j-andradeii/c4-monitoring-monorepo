import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Church } from './church.entity';
import { ChurchStaff } from './church-statff.entity';
import { ChurchCampusStaff } from './church-campus-staff.entity';
import { ChurchCampusType } from '../enums/church-campus-type';
import { ChurchCampusAddress } from './church-campus-address.entity';




@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class ChurchCampus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: ChurchCampusType, default: ChurchCampusType.MAIN })
    church_campus_type: ChurchCampusType;

    @Index()  // Create an index on reference_id
    @Column({ name: 'reference_id' })
    reference_id: string;

    @Column({ name: 'tag_line', nullable: true })
    tag_line: string;

    @Column({ type: 'text', nullable: true})
    description: string;

    @Column({
        type: 'date',
        name: 'established_date',
        nullable: true,
    })
    established_date: Date;

    @ManyToOne(() => Church, church => church.church_campuses)  // Many-to-one relationship with Order
    @JoinColumn({ name: 'church_id' })  // Foreign key column for order_id
    church: Church;

    @OneToMany(() => ChurchCampusStaff, churchCampusStaff => churchCampusStaff.church_campus)
    church_campus_staffs: ChurchCampusStaff[];

    @OneToMany(() => ChurchCampusAddress, churchCampusAddress => churchCampusAddress.churchCampus)
    church_campus_addresses: ChurchCampusAddress[];
}
