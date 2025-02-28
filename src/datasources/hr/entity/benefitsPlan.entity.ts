import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('benefits_plans')
export class BenefitsPlan {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({ type: 'varchar', length: 255 })
    planName: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    description: string;

    @Column({ type: 'bigint' })
    cost_per_month: number;
}
