import { Table, Column, Model, DataType, HasMany, ForeignKey, HasOne, BelongsTo } from "sequelize-typescript";
import Menu from "./menu";
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

    @ForeignKey(() => Menu)
    menuId: number

    @BelongsTo(() => Menu, {
        onDelete: "CASCADE"
    })
    menu: Menu

}
