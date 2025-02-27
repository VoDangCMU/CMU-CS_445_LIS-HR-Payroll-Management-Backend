import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Department } from './department.entity';

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn()
    employee_id: number;

    @Column({ type: 'varchar', length: 255 })
    full_name: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    phone: string;

    @Column({ type: 'enum', enum: ['Male', 'Female', 'Other'] })
    gender: string;

    @Column({ type: 'varchar', nullable: true })
    address: string;

    @Column({ type: 'enum', enum: ['Full-time', 'Part-time', 'Contract'] })
    employment_type: string;

    @Column({ type: 'enum', enum: ['Active', 'Inactive', 'On Leave'] })
    status: string;

    @ManyToOne(() => Department, (department) => department.employees)
    department: Department;

    @Column({ type: 'boolean', default: false })
    shareholder: boolean;

    @Column({ type: 'bigint' })
    base_salary: number;

    @Column({ type: 'bigint' })
    salary_coefficient: number;
}
