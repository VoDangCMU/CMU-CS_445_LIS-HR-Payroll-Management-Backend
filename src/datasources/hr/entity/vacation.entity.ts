import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('vacation_records')
export class VacationRecord {
    @PrimaryGeneratedColumn()
    record_id: number;

    @ManyToOne(() => Employee)
    employee: Employee;

    @Column({ type: 'date' })
    vacation_date: Date;

    @Column({ type: 'bigint' })
    vacation_days: number;
}
