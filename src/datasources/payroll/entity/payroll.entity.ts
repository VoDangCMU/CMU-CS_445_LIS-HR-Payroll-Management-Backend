import {Column, Entity, ObjectIdColumn} from "typeorm"
import {ObjectId} from "bson";

@Entity('payroll_records')
export class PayrollRecord {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    employeeID: number;

    @Column({type: 'date'})
    payDate: Date;

    @Column({type: 'bigint'})
    grossSalary: number;

    @Column({type: 'bigint'})
    netSalary: number;

    @Column({type: 'bigint'})
    deductions: number;

    @Column({type: 'bigint'})
    benefitsPaid: number;
}