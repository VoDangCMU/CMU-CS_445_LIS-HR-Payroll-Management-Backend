import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';
import { BenefitsPlan } from './benefitsPlan.entity';

@Entity('employee_benefits')
export class EmployeeBenefits {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @ManyToOne(() => Employee)
    employee: Employee;

    @ManyToOne(() => BenefitsPlan)
    benefitsPlan: BenefitsPlan;

    @Column()
    startDate: Date;
}
