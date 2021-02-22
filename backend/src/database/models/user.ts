import hasha from "hasha";
import Result from "./result";
import Role from "./role";
import { Table, Column, Model, HasMany, ForeignKey, Unique,  BelongsTo } from "sequelize-typescript";

@Table({timestamps: true, tableName: "user", freezeTableName: true})
export default class User extends Model{

    @Unique
    @Column
    username: string

    @HasMany(() => Result)
    results: Result[]

    @ForeignKey(() => Role)
    @Column
    rolId: number

    @BelongsTo(() => Role)
    role: Role

    @Column
    get password(): string{
        return this.getDataValue("password");
    }

    set password(password: string){
        this.setDataValue("password", hasha(password))
    }

    async getRole(): Promise<string>{
        if(this.rolId){
            const role = await Role.findOne({ where: { id: this.rolId } });
            return role.name;
        }else return null;
    }

    async setRole(name: string){
        if(!this.role || (this.role && (this.role.name !== name))){
            const target: Role = await Role.findOne({ where: { name: name } });
            await this.update({rolId: target.id});
        }
    }

}
