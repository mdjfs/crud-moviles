import database from "../database";
import { FormatedMenu } from "../database/models/menu";

const { Menu } = database.models;

interface MenuData {
    formId?: number,
    parentId?:number,
    name: string
}

async function create(data: MenuData){
    await Menu.create(data);
}

async function read(id: number, limit: number){
    if(id){
        const menu = await Menu.findOne({ where: { id: id } });
        const tree = await menu.getDescendants(limit);
        return tree;
    }else{
        const roots = await Menu.findAll({ where: { parentId: null } });
        const formatedRoots: FormatedMenu[] = [];
        for(const root of roots){
            const descendants: FormatedMenu = await root.getDescendants(limit);
            formatedRoots.push(descendants);
        }
        return formatedRoots;
    }
}

async function update(id: number, data: MenuData){
    const menu = await Menu.findOne({ where: { id: id } });
    await menu.update(data);
}

async function del(id: number){
    await Menu.destroy({ where: { id: id } });
}

export {create, read, del, MenuData};

export default {
    create: create,
    read: read,
    del: del,
    update: update
}
