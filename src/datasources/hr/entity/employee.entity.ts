import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {Department} from "@root/datasources/hr/entity/department.entity";

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    fullname: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    phone: string;

    @Column({ type: 'enum', enum: ['Male', 'Female', 'Other'] })
    gender: string;

    @Column({ type: 'varchar', nullable: true })
    address: string;

    @Column({ type: 'enum', enum: ['Full-time', 'Part-time', 'Contract'] })
    employmentType: string;

    @Column({ type: 'enum', enum: ['Active', 'Inactive', 'On Leave'] })
    status: string;

    @Column({ type: 'boolean', default: false })
    shareholder: boolean;

    @Column({ type: 'bigint' })
    baseSalary: number;

    @Column({ type: 'bigint' })
    salaryCoefficient: number;

    @ManyToOne(() => Department, {onDelete: 'CASCADE' })
    department: Department;
}
