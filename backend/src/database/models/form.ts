import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Menu from "./menu";
import Result from "./result";
import Section from "./section";

@Table({timestamps: true})
export default class Form extends Model{

    @Column
    name: string

    @Column({type: DataType.TEXT})
    description: string

    @HasMany(() => Result)
    results: Result[]

    @HasMany(() => Menu)
    menus: Menu[]

    @HasMany(() => Section)
    sections: Section[]
}
