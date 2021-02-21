import * as path from "path";

import { readFileSync } from "fs";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";


let config: SequelizeOptions = undefined;

try{
    const env = process.env.NODE_ENV || 'development';
    config = JSON.parse(readFileSync(path.join(__dirname, "config/config.json"), { encoding: "utf-8" }))[env];
}
catch(e){
    console.error(`Error loading database configuration: ${e.toString()}`);
}

/**
 * Sync database
 */
async function createDatabase(){
    const database = getDatabase();
    await database.sync({force: true});
}

/**
 * Get database object
 * @returns {Sequelize}
 */
function getDatabase(){
    return new Sequelize({
        ...config,
        models: [__dirname + '/models/*.ts']
    });
}

export {createDatabase, getDatabase};
export default getDatabase();