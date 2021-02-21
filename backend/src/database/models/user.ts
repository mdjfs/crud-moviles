import sha256 from "tiny-sha256";
import Result from "./result";
import Role from "./role";
import { Table, Column, Model, HasMany, ForeignKey } from "sequelize-typescript";

@Table({timestamps: true})
export default class User extends Model{

    @Column
    username: string

    @HasMany(() => Result)
    results: Result[]

    @ForeignKey(() => Role)
    @Column
    rolId: number

    @Column
    get password(): string{
        return this.getDataValue("password");
    }

    set password(password: string){
        this.setDataValue("password", sha256(password))
    }

    async getRole(): Promise<Role>{
        const role = await Role.findOne({ where: { id: this.rolId } });
        return role;
    }

    async setRole(name: string){
        const role = await Role.findOne({ where: { id: this.rolId } });
        if(role.name === name)
            this.rolId = role.id;
    }

}
