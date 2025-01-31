import { Entity, Index, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class Member {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()  // Create an index on church_id
    @Column({ type: 'uuid', name: 'church_id', nullable: false })
    church_id: string;


    @Index()  // Create an index on church_id
    @Column({ type: 'uuid', name: 'church_campus_id', nullable: true })
    church_campus_id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    first_name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    last_name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ type: 'timestamptz', nullable: true })
    birthdate: Date;

    @Index()  // Create an index on invited_by
    @Column({ type: 'uuid', name: 'invited_by', nullable: true })
    invited_by: string;
}