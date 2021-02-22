import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Result from "./result";
import Section from "./section";

@Table({timestamps: true, tableName: "form"})
export default class Form extends Model{

    @Column
    name: string

    @Column({type: DataType.TEXT})
    description: string

    @HasMany(() => Result, {
        onDelete: "CASCADE"
    })
    results: Result[]

    @HasMany(() => Section, {
        onDelete: "CASCADE"
    })
    sections: Section[]
}
