import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, OneToOne, CreateDateColumn } from 'typeorm';
import { ChurchCampus } from './church-campus.entity';
import { ChurchContactInfo } from './church-contact-info.entity';
import { ChurchAddress } from './church-address.entity';
import { ChurchStaff } from './church-statff.entity';



@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class Church {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @CreateDateColumn({ type: 'timestamptz' }) // Automatically sets value upon creation
  created_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  timezone: string;

  @OneToMany(() => ChurchCampus, churchCampus => churchCampus.church)
  church_campuses: ChurchCampus[];

  @OneToMany(() => ChurchAddress, churchAddress => churchAddress.church)
  church_addresses: ChurchAddress[];

  @OneToMany(() => ChurchStaff, churchStaff => churchStaff.church)
  church_staffs: ChurchStaff[];

  @OneToOne(() => ChurchContactInfo, churchContactInfo => churchContactInfo.church, {cascade: true, eager: true})
  church_contact_info: ChurchContactInfo;
}

