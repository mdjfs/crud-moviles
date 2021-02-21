import Form from "./form";
import Field from "./field";
import SectionField from "./sectionField"
import { Table, Column, Model, BelongsToMany, ForeignKey} from "sequelize-typescript";

@Table({timestamps: true})
export default class Section extends Model{

    @BelongsToMany(() => Field, () => SectionField)
    fields: Field[]

    @ForeignKey(() => Form)
    @Column
    formId: number

    @Column
    name: string
}
