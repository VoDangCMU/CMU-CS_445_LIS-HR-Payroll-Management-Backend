import {Entity, Column, ObjectIdColumn} from "typeorm"


@Entity('payroll_records')  
export class PayrollRecord {
    @ObjectIdColumn()
    payroll_id: number;

    @Column()
    employee_id: number;

    @Column({ type: 'date' })
    pay_date: Date;

    @Column({ type: 'bigint' })
    gross_salary: number;

    @Column({ type: 'bigint' })
    net_salary: number;

    @Column({ type: 'bigint' })
    deductions: number;

    @Column({ type: 'bigint' })
    benefits_paid: number;
}
