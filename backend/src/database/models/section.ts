import Form from "./form";
import Field from "./field";
import SectionField from "./sectionField"
import { Table, Column, Model, BelongsToMany, ForeignKey, BelongsTo} from "sequelize-typescript";

@Table({timestamps: true, tableName: "section", freezeTableName: true})
export default class Section extends Model{

    @BelongsToMany(() => Field, () => SectionField)
    fields: Field[]

    @ForeignKey(() => Form)
    @Column
    formId: number

    @BelongsTo(() => Form)
    form: Form[]

    @Column
    name: string
}
