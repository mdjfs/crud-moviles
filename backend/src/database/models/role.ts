import { Table, Column, Model, HasMany } from "sequelize-typescript";
import User from "./user";

@Table({timestamps: true})
export default class Role extends Model{

    @Column
    name: string

    @HasMany(() => User)
    users: User[]
}
