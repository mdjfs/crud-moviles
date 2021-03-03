
import Form from "./form";
import Queries from "../queries/constants";

import { QueryTypes } from "sequelize";

import { Table, Column, Model, ForeignKey, AllowNull,  BelongsTo, HasOne } from "sequelize-typescript";


interface FormatedMenu{
    id: number,
    name: string,
    parentId?: number,
    formId?:number,
    childrens: FormatedMenu[]
}

export {FormatedMenu};

@Table({timestamps: true, tableName: "menu", freezeTableName: true})
export default class Menu extends Model{

    
    @Column
    name: string

    @ForeignKey(() => Menu)
    @AllowNull
    @Column
    parentId: number

    @BelongsTo(() => Menu, {
        onDelete: "CASCADE"
    })
    menu: Menu

    @ForeignKey(() => Form)
    @AllowNull
    @Column
    formId: number

    @HasOne(() => Form, {
        onDelete: "CASCADE"
    })
    form: Form

    async getDescendants(limit: number=null): Promise<FormatedMenu>{
        const hasLimit = limit && !isNaN(limit);
        const replacements: {id: number, limit?: number} = { id: this.id }
        if(hasLimit) replacements.limit = limit;
        const query = this.sequelize.getDialect() == "mysql" ? Queries.MENU_RECURSIVE_MYSQL(hasLimit) : Queries.MENU_RECURSIVE_POSTGRESQL(hasLimit);
        const menus: Menu[] =  await this.sequelize.query(query, {replacements: replacements, model: Menu, type: QueryTypes.SELECT});
        return this.makeTree(menus);
    }

    private format(menu: Menu): FormatedMenu{
        return {
            "id": menu.id,
            "parentId": menu.parentId == menu.id ? null : menu.parentId,
            "name": menu.name,
            "formId": menu.formId,
            "childrens": []
        }
    }

    private makeTree(menus: Menu[]): FormatedMenu{
        let formatedMenus: FormatedMenu[] = menus.map(menu => this.format(menu)).sort((a, b) => a.id - b.id);
        const tree: FormatedMenu = formatedMenus.shift();
        const parse = (tree: FormatedMenu) => {
            tree.childrens = formatedMenus.filter(menu => {
                if(tree.id == menu.parentId){
                    parse(menu);
                    return true;
                } else return false;
            })
        }
        parse(tree);
        return tree;
    }
    

}