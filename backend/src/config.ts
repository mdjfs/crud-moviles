
import * as path from "path";
import { readFileSync } from "fs";

import { SequelizeOptions } from "sequelize-typescript";

interface configT{
    secretKey: string,
    port?: string,
    database:{
        development: SequelizeOptions,
        test: SequelizeOptions,
        production: SequelizeOptions
    }
}


function makeConfig(): configT{
    try{
        const json: configT = JSON.parse(readFileSync(path.join(__dirname, "../config.json"), { encoding: "utf-8" }));
        return json;
    }
    catch(e){
        console.error(`Error loading config file: ${e.toString()}`);
        return undefined;
    }
}

const config: configT = makeConfig();

const required = ["database", "secretKey"];

for(const key of required)
    if(!config[key]) throw new Error(`${key} is required in config.json`);

export default config;