import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('vacation_records')
export class VacationRecord {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @ManyToOne(() => Employee, {onDelete: "CASCADE"})
    employee: Employee;

    @Column({ type: 'date' })
    vacationDate: Date;

    @Column({ type: 'bigint' })
    vacationDays: number;
}
