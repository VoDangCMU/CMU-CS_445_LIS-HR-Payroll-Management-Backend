import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('department')
export class Department {
    @PrimaryGeneratedColumn()
    departmentID: number;

    @Column({ type: 'varchar', length: 255 })
    departmentName: string;
}
