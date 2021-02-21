import Section from "./section";
import Field from "./field";

import { Table, Column, Model, ForeignKey } from "sequelize-typescript";

@Table({timestamps: true})
export default class SectionField extends Model{

    @ForeignKey(() => Section)
    @Column
    sectionId: number

    @ForeignKey(() => Field)
    @Column
    fieldId: number
}
