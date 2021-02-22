import { Table, Column, Model, HasMany, Unique } from "sequelize-typescript";
import Field from "./field";

@Table({timestamps: true, tableName: "field_type", freezeTableName: true})
export default class FieldType extends Model{

    @Unique
    @Column
    name: string

    @HasMany(() => Field, {
        onDelete: "CASCADE"
    })
    fields: Field[]
}
