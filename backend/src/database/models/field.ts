import fieldType from "./fieldType";
import Section from "./section";
import SectionField from "./sectionField";
import { Table, Column, Model, AllowNull, ForeignKey, DataType, BelongsToMany, BelongsTo} from "sequelize-typescript";

@Table({timestamps: true, tableName: "field", freezeTableName: true})
export default class Field extends Model{

    @ForeignKey(() => fieldType)
    @Column
    fieldTypeId: number

    @BelongsTo(() => fieldType)
    fieldType: fieldType

    @BelongsToMany(() => Section, () => SectionField)
    sections: Section[]

    @Column({type: DataType.TEXT})
    question: string


    @AllowNull
    @Column({type: DataType.JSON})
    options: JSON
}
