

import { Sequelize, SequelizeOptions } from "sequelize-typescript";

import Field from "./models/field";
import FieldType from "./models/fieldType";
import Form from "./models/form";
import Menu from "./models/menu";
import Result from "./models/result";
import Role from "./models/role";
import User from "./models/user";
import Section from "./models/section";
import SectionField from "./models/sectionField";

import config from "../config";

const env = process.env.NODE_ENV || 'development';

const databaseConfig: SequelizeOptions = config.database[env];

/**
 * Sync database
 */
async function createDatabase(){
    const database = getDatabase();
    await database.sequelize.sync({force: true});
    return database;
}

/**
 * Get database object
 * @returns {Array[Sequelize, Models]}
 */
function getDatabase(){
    const models = [Role, User, Result, Form, Menu, Section, SectionField, Field, FieldType];
    const sequelize = new Sequelize(databaseConfig);
    sequelize.addModels(models);
    return {
        sequelize: sequelize,
        models:{
            Role: Role,
            User: User,
            Result: Result,
            Form: Form,
            Menu: Menu,
            Section: Section,
            SectionField: SectionField,
            FieldType: FieldType,
            Field: Field
        }
    };
}

export {createDatabase, getDatabase};
export default getDatabase();