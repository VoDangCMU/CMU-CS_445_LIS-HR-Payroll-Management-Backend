import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';
import { BenefitsPlan } from './benefitsPlan.entity';

@Entity('employee_benefits')
export class EmployeeBenefits {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @ManyToOne(() => Employee, {onDelete: "CASCADE"})
    employee: Employee;

    @ManyToOne(() => BenefitsPlan, {onDelete: "CASCADE"})
    benefitsPlan: BenefitsPlan;

    @Column()
    startDate: Date;
}
