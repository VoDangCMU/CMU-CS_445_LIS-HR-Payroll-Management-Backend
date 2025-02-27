import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';
import { BenefitsPlan } from './benefits_plan.entity';

@Entity('employee_benefits')
export class EmployeeBenefits {
    @PrimaryGeneratedColumn()
    record_id: number;

    @ManyToOne(() => Employee)
    employee: Employee;

    @ManyToOne(() => BenefitsPlan)
    benefits_plan: BenefitsPlan;

    @Column({ type: 'date' })
    start_date: Date;
}
