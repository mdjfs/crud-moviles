
import Form from "./form";
import Queries from "../queries/constants";

import { QueryTypes } from "sequelize";

import { Table, Column, Model, ForeignKey, AllowNull, Sequelize, BelongsTo } from "sequelize-typescript";


interface FormatedMenu{
    id: number,
    name: string,
    parentId?: number,
    formId?:number,
    childrens: FormatedMenu[]
}

@Table({timestamps: true})
export default class Menu extends Model{

    
    @Column
    name: string

    @ForeignKey(() => Menu)
    @AllowNull
    @Column
    parentId: number

    @BelongsTo(() => Menu)
    menu: Menu

    @ForeignKey(() => Form)
    @AllowNull
    @Column
    formId: number


    async getDescendants(sequelize: Sequelize, limit=null): Promise<FormatedMenu>{
        const menus: Menu[] =  await sequelize
            .query(limit ? Queries.MENU_RECURSIVE_DESCENDANT_LIMIT : Queries.MENU_RECURSIVE_DESCENDANT_NO_LIMIT, 
            {replacements: limit ? { id: this.id, limit: limit  } : { id: this.id  } , 
            model: Menu, type: QueryTypes.SELECT});
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
        const formatedMenus: FormatedMenu[] = menus.map(menu => this.format(menu)).sort((a, b) => a.id - b.id);
        const tree: FormatedMenu = formatedMenus.shift();
        const parse = (tree: FormatedMenu) => {
            for(const menu of formatedMenus){
                if(tree.id = menu.parentId){
                    tree.childrens.push(menu);
                    parse(menu);
                }
            }
        }
        parse(tree);
        return tree;
    }
    

}