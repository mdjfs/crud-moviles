import database from "../database";

const { Result } = database.models;

interface ResultData {
    id?:string,
    name: string,
    result: JSON,
    userId: number,
    formId: number
}

interface ResultTarget {
    id?:number,
    formId?:number,
    userId?:number
}

/**
 * Creates a result
 * @param data Result Data
 */
async function create(data: ResultData){
    await Result.create(data);
}

/**
 * Gets results by target
 * @param target Result Target
 */
async function read(target: ResultTarget) : Promise<ResultData[]> {
    const results = await Result.findAll({ where: { ...target } });
    return results.map(result => ({
        id: result.id,
        name: result.name,
        result: result.result,
        userId: result.userId,
        formId: result.formId
    }))
}

/**
 * Deletes results by target
 * @param target Result Target
 */
async function del(target: ResultTarget){
    await Result.destroy({ where: { ...target } });
}


export {create, read, del, ResultData, ResultTarget};

export default {
    create: create,
    read: read,
    del: del
}
