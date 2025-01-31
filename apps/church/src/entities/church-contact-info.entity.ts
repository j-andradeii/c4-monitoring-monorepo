import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Church } from './church.entity';

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class ChurchContactInfo {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Church)
    @JoinColumn({ name: 'church_id' })  // This specifies the foreign key column in the Address table
    church: Church;

    @Column({ type: 'varchar', length: 255, nullable: false })
    phone_number: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    website: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    church_logo: string;
}