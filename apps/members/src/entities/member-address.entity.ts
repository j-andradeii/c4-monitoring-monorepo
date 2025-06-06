import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member.entity";

@Entity()
@Index(['id'], { unique: true })  // Unique composite index on id and user_id
export class MemberAddress {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Member, member => member.contact_infos, {cascade: true, eager: true})
    @JoinColumn({ name: 'member_id' })
    member: Member;
    
    @Column({ type: 'varchar', length: 255, nullable: false })
    street: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    city: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    state: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    zip_code: string;

}