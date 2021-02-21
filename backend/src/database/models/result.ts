import { Table, Column, Model, ForeignKey, DataType } from "sequelize-typescript";
import Form from "./form";
import User from "./user";

@Table({timestamps: true})
export default class Result extends Model{

    @Column
    name: string

    @ForeignKey(() => Form)
    formId: number

    @ForeignKey(() => User)
    userId: number

    @Column({type: DataType.JSON})
    result: JSON
}
