import database from "../database";

const { Form, Field, Section, FieldType, SectionField } = database.models;

interface FormData{
    name: string,
    description: string,
    sections: SectionData[],
    createdAt?: string,
    updatedAt?:string
}

interface SectionData{
    name: string,
    fieldsId?: number[],
    fields?: FieldData[]
}

interface FieldData{
    question: string,
    type: string,
    options?: JSON
}

/**
 * Creates a form
 * @param data Form Data
 */
async function create(data: FormData){
    const form = await Form.create(data);
    for(const sectionData of data.sections){
        const section = await Section.create({ name: sectionData.name, formId: form.id });
        if(sectionData.fieldsId){
            for(const fieldId of sectionData.fieldsId){
                await SectionField.create({sectionId: section.id, fieldId: fieldId});
            }
        }
        if(sectionData.fields){
            for(const fieldData of sectionData.fields){
                const type = await FieldType.findOne({where: { name: fieldData.type } });
                if(type){
                    const field = await Field.create({ question: fieldData.question, options: fieldData.options, fieldTypeId: type.id });
                    await SectionField.create({sectionId: section.id, fieldId: field.id});
                }
            }
        }
    }
    return form.id;
}

interface FormTarget{
    id?:number,
    menuId?:number
}

/**
 * Read a form
 * @param target Form target
 */
async function read(target: FormTarget): Promise<FormData>{
    let data: FormData = undefined;
    const form = await Form.findOne({ where: { ...target } });
    data = {
        name: form.name,
        description: form.description,
        sections: [],
        createdAt: form.createdAt,
        updatedAt: form.updatedAt
    }
    const sections = await Section.findAll({ where: { formId: form.id }});
    for(const section of sections){
        const fieldsId = [];
        const fields = [];
        const sectionFields = await SectionField.findAll({ where: { sectionId: section.id }});
        for(const sectionField of sectionFields){
            const field = await Field.findOne({ where: { id: sectionField.fieldId } });
            const type = await FieldType.findOne({ where: { id: field.fieldTypeId }});
            fieldsId.push(field.id);
            fields.push({
                question: field.question,
                options: field.options,
                type: type.name
            })
        }
        data.sections.push({
            name: section.name,
            fieldsId: fieldsId,
            fields: fields
        });
    }
    return data;
}

/**
 * Get all forms
 */
async function getAll(){
    const forms = await Form.findAll();
    return forms;
}

/**
 * Delete a form
 * @param target  Form Target
 */
async function del(target: FormTarget){
    await Form.destroy({ where: { ...target } });
}


export {create, read, del, FormData, FormTarget, SectionData, FieldData};

export default {
    create: create,
    read: read,
    del: del,
    getAll: getAll
}
