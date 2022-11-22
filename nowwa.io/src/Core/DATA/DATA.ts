import mongoose, { mongo } from 'mongoose';
import CONFIG from '../CONFIG/CONFIG';
import { Custom, CustomProperty, CustomType, CustomDocument } from '../../Models/Custom';
import TABLE_MODEL from './TABLE_MODEL';
import LOG, { log, error } from '../../UTIL/LOG';
import QUERY from '../../UTIL/QUERY';
import { query } from 'express';
import ARRAY from '../../UTIL/ARRAY';

class DATA {
    /*=============== 


    INIT


    ================*/

    public static async init(): Promise<void> {
        log(`init database...`);

        let uri: string = `mongodb+srv://${CONFIG.vars.MONGODB_USER}:${CONFIG.vars.MONGODB_PASS}@${CONFIG.vars.MONGODB_HOST}/${CONFIG.vars.MONGODB_DB}`;

        log(`connect to: ${uri}`);

        await mongoose.connect(uri,
            {
                ssl: true,
                sslValidate: false,
                sslCert: `${CONFIG.vars.MONGODB_CERT}`

            }).then((result) => {
                log("Successfully connect to MongoDB.");
            }).catch((e: Error) => {
                error("Connection error", e);
                throw e;
            });

        return Promise.resolve();
    }

    /*=============== 


    GET
    

    ================*/

    public static async get( tableName: string, vars: any): Promise<any> 
    {
        vars            = QUERY.get(vars);

        let model       = await TABLE_MODEL.get(tableName);
        let myQuery     = model.find(vars.where);

        if ( vars.limit ) myQuery.limit( vars.limit );

        let documents : mongoose.Document<any, any, any>[] = await myQuery.exec();

        return Promise.resolve( ARRAY.getFields( documents, vars.values ) );
    }

    public static async getOne(tableName: string, query: any): Promise<mongoose.Document<any, any, any> | null> 
    {
        query           = QUERY.get(query);
        let model       = await TABLE_MODEL.get(tableName);
        let myQuery     = model.findOne(query.where);
        let document    = await myQuery.exec();
 
        return Promise.resolve( ARRAY.getFields( document, query.values ));
    }

    /*=============== 


    SET
    

    ================*/

    public static async set(tableName: string, query: any): Promise<mongoose.Document<any, any, any>> 
    {
        query           = QUERY.set( query );

        if (query.where) return this.change( tableName, query );

        let model       = await TABLE_MODEL.get( tableName );
        let document    = await model.create( query.values );

        return Promise.resolve( document );
    }

    /*=============== 


    CHANGE
    

    ================*/

    public static async change(tableName: string, query: any): Promise<mongoose.Document<any, any, any>> {
        query = QUERY.change(query);

        let model = await TABLE_MODEL.get(tableName);
        let myQuery = model.find(query.where as any).limit(1);
        let documents = await myQuery.exec();

        if (!documents || documents.length != 1) return Promise.reject(LOG.msg('entry not found'));

        let document: mongoose.Document<any, any, any> & { [key: string]: any } = documents[0];

        let fieldNames = Object.keys(query.values!);

        for (let i: number = 0; i < fieldNames.length; i++) {
            let fieldName = fieldNames[i];
            let fieldValue = query.values![fieldName];

            document.set(fieldName, fieldValue);
            document.markModified(fieldName);
        }

        await document.save();
        return Promise.resolve(document);
    };

    public static async reparent(tableName: string, newUID: any, oldUID: any): Promise<any> {
        let results = await DATA.change(tableName, { values: { uID: newUID }, where: { uID: oldUID } });

        return Promise.resolve(results);
    }

    /*=============== 


    REMOVE
    

    ================*/

    public static async remove(tableName: string, query: any): Promise<void> {
        let model = await TABLE_MODEL.get(tableName);

        await model.findOneAndDelete(QUERY.get(query));

        return Promise.resolve();
    };

    /*===============


    STRICT TYPE - IGNORE


    ================*/

    //#region "STRICT TYPE - IGNORE"

    public static async get2<T>(tableName: string, where: Partial<T>): Promise<(mongoose.Document<any, any, any> & Partial<T>)[]> {
        let model = await TABLE_MODEL.get(tableName);
        let myQuery = model.find(where);

        return myQuery.exec();
    }


    public static async getOne2<T>(tableName: string, where: Partial<T>): Promise<(mongoose.Document<any, any, any> & Partial<T>) | null> {
        let model = await TABLE_MODEL.get(tableName);
        let myQuery = model.findOne(where);

        return myQuery.exec();
    }

    public static async set2<T>(tableName: string, query: Partial<T>, where?: Partial<T>): Promise<DATA.DOCUMENT<T>> {
        if (where) return this.change2<T>(tableName, query, where);

        let model = await TABLE_MODEL.get(tableName);
        let document: mongoose.Document<any, any, any> & Partial<T> = await model.create(query);

        return Promise.resolve(document);
    }

    public static async change2<T>(tableName: string, where: Partial<T>, values: Partial<T>): Promise<DATA.DOCUMENT<T>> {

        let model = await TABLE_MODEL.get(tableName);
        let myQuery = model.find(where).limit(1);
        let documents: DATA.DOCUMENT<T>[] = await myQuery.exec();

        if (!documents || documents.length != 1) return Promise.reject(LOG.msg('entry not found'));

        let document: DATA.DOCUMENT<T> = documents[0];

        let fieldNames = Object.keys(values);

        for (let i: number = 0; i < fieldNames.length; i++) {
            let fieldName: string = fieldNames[i];
            let fieldValue = values[fieldName as keyof T];

            document!.set(fieldName, fieldValue);
            document!.markModified(fieldName);
        }

        await document!.save();
        return Promise.resolve(document);
    };

    public static async remove2<T>(tableName: string, where: Partial<T>): Promise<DATA.DOCUMENT<T>> {
        let model = await TABLE_MODEL.get(tableName);

        return model.findOneAndDelete(where).exec();
    };

    //#endregion "STRICT TYPE - IGNORE"

}

namespace DATA {
    export type DOCUMENT<T> = (mongoose.Document<any, any, any> & Partial<T>) | null;
    export type FieldType = string | number | boolean | object | Date;
    export type Fields = { [key: string]: FieldType }

    export const ReservedSchemaName: string[] =
        [
            'User',
            'Custom',
            'File'
        ];

    export const FieldTypeList: DATA.FieldType[] =
        [
            'string',
            'number',
            'boolean',
            'object',
            'date'
        ];

    export type MapSchemaTypes =
        {
            string: string;
            number: number;
            boolean: boolean;
            object: object;
            date: Date;
        }

    export type Query =
        {
            remove?: string[],
            add?: { [key: string]: string }
            values?: { [key: string]: any },
            types?: { [key: string]: string },
            where?: {
                [key: string]:
                string |
                number |
                boolean |
                {
                    $lt?: number, // less than
                    $lte?: number, // less than equal to
                    $gt?: number, // greater than
                    $gte?: number, // greater than equal to
                    $ne?: number, // not equal to
                    $in?: number[] | string[], // in an array of
                    $nin?: number[] | string[], // not in an array of 
                    $regex?: string | RegExp, // match regex
                    $size?: number, // is an array with size of   
                }
            },
            limit?: number,
        }
}

namespace DATA {

}

export default DATA;