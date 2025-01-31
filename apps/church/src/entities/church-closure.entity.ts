import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index(['id'], { unique: true })
export class ChurchClosure {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'uuid', name: 'ancestor_id' })
    ancestor_id: string;

    @Index() 
    @Column({ type: 'uuid', name: 'descendant_id' })
    descendant_id: string;

    @Index()
    @Column({ type: 'int' })
    depth: number;
}
