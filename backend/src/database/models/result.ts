import { Table, Column, Model, ForeignKey, DataType, BelongsTo } from "sequelize-typescript";
import Form from "./form";
import User from "./user";

@Table({timestamps: true, tableName: "result", freezeTableName: true})
export default class Result extends Model{

    @Column
    name: string

    @ForeignKey(() => Form)
    formId: number

    @ForeignKey(() => User)
    userId: number

    @BelongsTo(() => Form)
    form: Form

    @BelongsTo(() => User)
    user: User

    @Column({type: DataType.JSON})
    result: JSON
}
