import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';
import { ChurchCampus } from './church-campus.entity';


@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class Church {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'timestamptz', nullable: false })
  created_at: string;  // UTC datetime

  @Column({ type: 'varchar', length: 255, nullable: true })
  timezone: string;

  @OneToMany(() => ChurchCampus, churchCampus => churchCampus.church)
  church_campuses: ChurchCampus[];
}

