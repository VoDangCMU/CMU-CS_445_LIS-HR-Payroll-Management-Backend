import {Entity, Column, ObjectIdColumn} from "typeorm"
import {ObjectId} from "mongodb";


@Entity('payroll_records')
export class PayrollRecord {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    employeeID: number;

    @Column({ type: 'date' })
    payDate: Date;

    @Column({ type: 'bigint' })
    grossSalary: number;

    @Column({ type: 'bigint' })
    netSalary: number;

    @Column({ type: 'bigint' })
    deductions: number;

    @Column({ type: 'bigint' })
    benefits_paid: number;
}