import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';


@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class church {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

}

