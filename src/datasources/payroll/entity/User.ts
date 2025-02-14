import {Entity, Column, ObjectIdColumn} from "typeorm"
import {ObjectId} from "mongodb";

export const USER_TABLE_NAME = "users";

@Entity({name: USER_TABLE_NAME})
export class User {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    dateOfBirth: Date

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    phone: string

    @Column()
    email: string

    @Column()
    address: string
}