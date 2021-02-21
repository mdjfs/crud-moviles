import { Table, Column, Model, HasMany } from "sequelize-typescript";
import Field from "./field";

@Table({timestamps: true})
export default class FieldType extends Model{

    @Column
    name: string

    @HasMany(() => Field)
    fields: Field[]
}
