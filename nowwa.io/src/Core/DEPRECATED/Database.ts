import mongoose, { mongo } from 'mongoose';
import express from 'express';
import Environment from '../Environment';
import { Custom, CustomProperty, CustomType, CustomDocument } from '../../Models/Custom';

class Database {

    private static Instance:Database;

    private static BaseUrl:string = `/database`;

    private models:{[key:string]:mongoose.Model<any, {}, {}>};

    constructor () {
        this.models = {};
    }

    /**
     * Initialize Database module.
     */
    public static async AsyncInit (app:express.Express, env:Environment.Config):Promise<void> {
        Database.Instance = new Database();
        await Database.Connect(env);
        Database.WebhookStructureSave(app);
        Database.WebhookStructureLoad(app);
        Database.WebhookDataSave(app);
        Database.WebhookDataLoad(app);
        return Promise.resolve();
    }

    /**
     * Initialize database connection.
     */
    private static async Connect (env:Environment.Config) {
        console.log(`init database...`);

        let uri:string = `mongodb+srv://${env.MONGODB_USER}:${env.MONGODB_PASS}@${env.MONGODB_HOST}/${env.MONGODB_DB}`;
        console.log(`connect to: ${uri}`);
        await mongoose.connect(uri, {
            ssl: true,
            sslValidate: false,
            sslCert: `${env.MONGODB_CERT}`
        })
        .then((result) => {
            console.log("Successfully connect to MongoDB.");
        })
        .catch((error:Error) => {
            console.error("Connection error", error);
            throw error;
        });
    }

    /**
     * Create a custom model.
     */
    private static CreateModel (schemaName:string, fields:any) {
        console.log(`database create custom model...`);
          
        type MapSchema<T extends Record<string, keyof Database.MapSchemaTypes>> = {
            -readonly [K in keyof T]: Database.MapSchemaTypes[T[K]]
        }

        function asSchema<T extends Record<string, keyof Database.MapSchemaTypes>>(t: T): T {
            return t;
        }
        // let fields = rawFields instanceof Map ? Object.fromEntries(rawFields) : rawFields;
        let data = asSchema(fields);
        let structure = {};
        let fieldNames = Object.keys(fields);
        for (let i:number = 0; i < fieldNames.length; i++) {
            let fieldName = fieldNames[i];
            let fieldType = fields[fieldName];
            if (fieldType == 'string') {
                structure = { 
                    ...structure,
                    [fieldName] : {
                        type    : String
                    }
                };
            } 
            else if (fieldType == 'number') {
                structure = { 
                    ...structure,
                    [fieldName] : {
                        type    : Number
                    }
                };
            }
            else if (fieldType == 'boolean') {
                structure = { 
                    ...structure,
                    [fieldName] : {
                        type    : Boolean
                    }
                };
            }
            else if (fieldType == 'date') {
                structure = { 
                    ...structure,
                    [fieldName] : {
                        type    : Date
                    }
                };
            }
            else if (fieldType == 'object') {
                structure = { 
                    ...structure,
                    [fieldName] : {
                        type    : mongoose.Schema.Types.Mixed
                    }
                };
            }
        }
        type DataType = MapSchema<typeof data>;
        
        type NewDocument = mongoose.Document & DataType;

        const NewSchema = new mongoose.Schema<NewDocument>(structure, {
            strict      : "throw"
        });

        console.log(`database custom model '${schemaName}' created!`);
        return mongoose.model(schemaName, NewSchema);
    }

    /**
     * Webhook to save custom schema structure. 
     * @param app @type {express.Express}
     */
    private static WebhookStructureSave (app:express.Express):void {
        let url:string = `/structure/save`;
        app.post(`${Database.BaseUrl}${url}`, async (req:express.Request, res:express.Response) => {
            console.log(`<-- request schema structure save`);

            let schemaFields = <{[key:string]:any}>(req.body.schemaFields);
            let schemaName = <string>(req.body.schemaName);

            Database.StructureSave(schemaName, schemaFields)
                .then((structure:CustomType) => {
                    res.send({ 
                        success         : true, 
                        value           : structure
                    });
                })
                .catch((error:Error) => {
                    res.send({ success: false, error: error.message });
                });
        });
    }

    /**
     * Webhook to load custom schema structure. 
     * @param app @type {express.Express}
     */
    private static WebhookStructureLoad (app:express.Express):void {
        let url:string = `/structure/load`;
        app.post(`${Database.BaseUrl}${url}`, async (req:express.Request, res:express.Response) => {
            console.log(`<-- request schema structure load`);

            try {
                let schemaNames = <string[]>(req.body.schemaNames);
                let schemas:CustomType[] = await Database.StructureLoad(schemaNames);
                res.send({ success: true, value: schemas });
            }
            catch (error) {
                res.send({ success: false, error: (<Error>error).message });
            }
        });
    }

    /**
     * Webhook to save custom schema data. 
     * @param app @type {express.Express}
     */
    private static WebhookDataSave (app:express.Express):void {
        let url:string = `/data/save`;
        app.post(`${Database.BaseUrl}${url}`, async (req:express.Request, res:express.Response) => {
            console.log(`<-- request schema structure save`);

            let schemaFields = <{[key:string]:any}>(req.body.schemaFields);
            let schemaName = <string>(req.body.schemaName);

            Database.DataSave(schemaName, schemaFields)
                .then((structure:CustomDocument) => {
                    res.send({ 
                        success         : true, 
                        value           : structure
                    });
                })
                .catch((error:Error) => {
                    res.send({ success: false, error: error.message });
                });
        });
    }

    /**
     * Webhook to load custom schema data. 
     * @param app @type {express.Express}
     */
    private static WebhookDataLoad (app:express.Express):void {
        let url:string = `/data/load`;
        app.post(`${Database.BaseUrl}${url}`, async (req:express.Request, res:express.Response) => {
            console.log(`<-- request schema structure load`);

            try {
                let schemaNames = req.body.schemaNames;
                let schemas:CustomType[] = await Database.StructureLoad(schemaNames);
                res.send({ success: true, value: schemas });
            }
            catch (error) {
                res.send({ success: false, error: (<Error>error).message });
            }
        });
    }

    /**
     * Load custom schema structures.
     */
    public static async StructureLoad (schemaNames?:string[]):Promise<CustomType[]> {
        let query;
        if (schemaNames) {
            let $or:{[key:string]:any}[] = [];
            for (let i = 0; i < schemaNames.length; i++) {
                $or.push({
                    [`${CustomProperty.schemaName}`]  : schemaNames[i]
                });
            }
            query = Custom.find({
                $or: $or 
            });
        } else {
            query = Custom.find({ });
        }
        query.select(`${CustomProperty.schemaName} ${CustomProperty.schemaFields}`);

        
        let data = await query.exec();

        let output:CustomType[] = [];

        for (let i = 0; i < data.length; i++) {
            output.push({
                schemaName      : data[i].schemaName,
                schemaFields    : data[i].schemaFields
            });
        }
        return Promise.resolve(output);
    }

    /**
     * Save custom schema structures.
     */
    public static async StructureSave (schemaName:string, schemaFields:Database.Query):Promise<CustomType> {

        if (Database.ReservedSchemaName.includes(schemaName)) {
            throw new Error(`schema name '${schemaName}' is not allowed!`);
        }

        let finalFields:Database.Fields = {...schemaFields.add};
        let finalFieldNames:string[] = Object.keys(finalFields);
        for (let i:number = 0; i < finalFieldNames.length; i++) {
            let finalFieldName:string = finalFieldNames[i];
            let finalFieldType:Database.FieldType = finalFields[finalFieldName];
            if (Database.FieldTypeList.indexOf(finalFieldType) < 0) {
                throw new Error(`field '${finalFieldName}' has an invalid type of '${finalFieldType}'!`);
            }
        }

        // Check if old schema exists
        let originalFilter:CustomType = {
            schemaName      : schemaName
        };
        let query = Custom.findOne(originalFilter);
        let structure = await query.exec();
        if (structure) {
            
            // Check loaded models
            let model = Database.Instance.models[schemaName];
            if (model) {
                for (let i:number = 0; i < finalFieldNames.length; i++) {
                    let finalFieldName:string = finalFieldNames[i];
                    if (!structure.schemaFields[finalFieldName]) {
                        model.schema.add({
                            [finalFieldName] : finalFields[finalFieldName]
                        } as any);
                    }
                }
            }

            // Combine old fields with new fields
            finalFields = {
                ...structure.schemaFields,
                ...finalFields,
            };
            if (schemaFields.remove) {
                for (let i = 0; i < schemaFields.remove.length; i++) {
                    let schemaFieldName = schemaFields.remove[i];
                    delete finalFields[schemaFieldName];
                    if (model) {
                        if (!model.schema.path(schemaFieldName)) {
                            throw new Error(`field '${schemaFieldName}' cannot be removed as it does not exists!`);
                        }
                        model.schema.remove(schemaFieldName);
                    }
                }
            }
            structure.schemaFields = finalFields;
            structure.markModified(CustomProperty.schemaFields);
            structure = await structure.save();
        } else {
            let newStructure:CustomType = {
                schemaName      : schemaName,
                schemaFields    : finalFields 
            }
            structure = await Custom.create(newStructure);
        }
        return Promise.resolve({
            schemaName: schemaName,
            schemaFields: structure.schemaFields
        });
    }

    /**
     * Create or update a schema data.
     */
     public static async DataSave (schemaName:string, schemaFields:Database.Query):Promise<CustomDocument> {
        let schemas:CustomType[] = await Database.StructureLoad([schemaName]);
        
        if (schemas) 
        {
            if (!Database.Instance.models[schemaName]) 
            {
                Database.Instance.models[schemaName] = Database.CreateModel(schemaName, schemas[0].schemaFields);
            }
            let model = Database.Instance.models[schemaName];

            if (schemaFields.where) 
            {
                let query = model.find(schemaFields.where).limit(1);
                let documents = await query.exec();
                if (documents && documents.length == 1) {
                    let document = documents[0];
                    let fieldNames = Object.keys(schemaFields.values!);
                    for (let i:number = 0; i < fieldNames.length; i++) {
                        let fieldName = fieldNames[i];
                        let fieldValue = schemaFields.values![fieldName];
                        document[fieldName] = fieldValue;
                    }
                    await document.save();
                    return Promise.resolve(document);
                }
                return Promise.reject(new Error(`matching entry not found!`));
            }
            let document = await model.create(schemaFields.values);
            return Promise.resolve(document);
        }
        return Promise.reject(new Error(`schema '${schemaName}' not found!`));
    }

    /**
     * Load a schema data.
     */
    public static async DataLoad (schemaName:string, schemaFields:Database.Query):Promise<CustomDocument[]> {
        let schemas:CustomType[] = await Database.StructureLoad([schemaName]);
        if (schemas && schemas.length > 0) {
            if (!Database.Instance.models[schemaName]) {
                console.log(`register new model: ${schemaName}...`)
                Database.Instance.models[schemaName] = Database.CreateModel(schemaName, schemas[0].schemaFields);
            }
            let model = Database.Instance.models[schemaName];
            let query = model.find(schemaFields.where || {});
            if (schemaFields.limit) {
                query.limit(schemaFields.limit);
            }
            let documents = await query.exec();
            return Promise.resolve(documents);
        }
        return Promise.reject(new Error(`schema '${schemaName}' not found!`));
    }

    /**
     * Delete a schema data.
     */
    public static async DataDelete(schemaName: string, schemaFields: Database.Query): Promise<void> {
        let schemas: CustomType[] = await Database.StructureLoad([schemaName]);
        if (schemas && schemas.length > 0) {
            if (!Database.Instance.models[schemaName]) {
                console.log(`register new model: ${schemaName}...`)
                Database.Instance.models[schemaName] = Database.CreateModel(schemaName, schemas[0].schemaFields);
            }
            let model = Database.Instance.models[schemaName];
            let query = model.find(schemaFields.where || {});
            if (schemaFields.limit) {
                query.limit(schemaFields.limit);
            }
            await model.deleteOne(query);
            return Promise.resolve();
        }
        return Promise.reject(new Error(`schema '${schemaName}' not found!`));
    }
}

namespace Database {

    export const ReservedSchemaName:string[] = [
        'User',
        'Custom',
        'File'
    ];
    
    export const FieldTypeList:FieldType[] = [
        'string',
        'number',
        'boolean',
        'object',
        'date'
    ];
        
    export type MapSchemaTypes = {
        string      : string;
        number      : number;
        boolean     : boolean;
        object      : object;
        date        : Date;
    }

    export type FieldType = string | number | boolean | object | Date;

    export type Fields = {[key:string]: FieldType }

    export type Query = {
        remove? : string[],
        add?    : {[key:string]:string}
        values? : {[key:string]:any},
        types?  : {[key:string]:string},
        where?  : {[key:string]:
            string | 
            number | 
            boolean |
            {
                $lt?    : number, // less than
                $lte?   : number, // less than equal to
                $gt?    : number, // greater than
                $gte?   : number, // greater than equal to
                $ne?    : number, // not equal to
                $in?    : number[] | string[], // in an array of
                $nin?   : number[] | string[], // not in an array of 
                $regex? : string | RegExp, // match regex
                $size?  : number, // is an array with size of   
            }
        },
        limit?  : number,
    }
}

export default Database;