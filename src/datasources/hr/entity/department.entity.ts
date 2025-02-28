import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('department')
export class Department {
    @PrimaryGeneratedColumn()
    department_id: number;

    @Column({ type: 'varchar', length: 255 })
    department_name: string;

    @OneToMany(() => Employee, (employee) => employee.department)
    employees: Employee[];
}
