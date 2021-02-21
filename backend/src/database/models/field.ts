import fieldType from "./fieldType";
import Section from "./section";
import SectionField from "./sectionField";
import { Table, Column, Model, AllowNull, ForeignKey, DataType, BelongsToMany} from "sequelize-typescript";

@Table({timestamps: true})
export default class Field extends Model{

    @ForeignKey(() => fieldType)
    @Column
    fieldTypeId: number

    @BelongsToMany(() => Section, () => SectionField)
    sections: Section[]

    @Column({type: DataType.TEXT})
    question: string


    @AllowNull
    @Column({type: DataType.JSON})
    options: JSON
}
