import { Entity, Index, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail } from 'class-validator';

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class Auth {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEmail()
  @Index()
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Index()
  @Column({ type: 'varchar', nullable: true, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false, select: false }) // select: false prevents it from being returned by default in queries
  password: string;
}