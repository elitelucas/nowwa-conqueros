import mongoose, { mongo } from 'mongoose';
import Environment from '../CONFIG/Environment';
import { Custom, CustomProperty, CustomType, CustomDocument } from '../../Models/Custom';
import TABLE_MODEL from './TABLE_MODEL';
import LOG, { log, error } from '../../UTIL/LOG';

class DATA 
{
    /*=============== 


    INIT


    ================*/

    public static async init(env: Environment.Config): Promise<void> 
    {
        log(`init database...`);

        let uri: string = `mongodb+srv://${env.MONGODB_USER}:${env.MONGODB_PASS}@${env.MONGODB_HOST}/${env.MONGODB_DB}`;

        log(`connect to: ${uri}`);

        await mongoose.connect(uri,
            {
                ssl: true,
                sslValidate: false,
                sslCert: `${env.MONGODB_CERT}`

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

    public static async get(tableName: string, query: DATA.Query): Promise<mongoose.Document<any, any, any>[]> 
    {
        let model   = await TABLE_MODEL.get(tableName);
        let myQuery = model.find(query.where || {});

        if( query.limit ) myQuery.limit(query.limit);

        let documents = await myQuery.exec();

        if( documents ) return Promise.resolve(documents);
        return Promise.reject(new Error('entry not found'));
    }
 
    /*=============== 


    SET
    

    ================*/

    public static async set( tableName: string, query: DATA.Query): Promise<mongoose.Document<any, any, any>> 
    {
        if( query.where) return DATA.change( tableName, query );

        let model       = await TABLE_MODEL.get( tableName );
        let document    = await model.create( query.values );

        return Promise.resolve( document );
    }

    /*=============== 


    CHANGE
    

    ================*/

    public static async change( tableName: string, query: DATA.Query): Promise<mongoose.Document<any, any, any>> 
    {
        let model = await TABLE_MODEL.get(tableName);

        let myQuery = model.find(query.where as any).limit(1);
        let documents = await myQuery.exec();

        if ( !documents || documents.length != 1) return Promise.reject(new Error(`matching entry not found!`));

        let document    = documents[0];
        let fieldNames  = Object.keys(query.values!);

        for (let i: number = 0; i < fieldNames.length; i++) {
            let fieldName = fieldNames[i];
            let fieldValue = query.values![fieldName];

            document[fieldName] = fieldValue;
        }
        await document.save();
        return Promise.resolve( document );
    };
 
    /*=============== 


    REMOVE
    

    ================*/

    public static async remove(tableName: string, query: DATA.Query): Promise<void> 
    {
        let model = await TABLE_MODEL.get(tableName);

        if (query.where && query.where._id) (query.where as any)._id = new mongoose.mongo.ObjectId((query.where as any)._id);
        
        let myQuery = model.find(query.where as any).limit(1);
        await model.deleteOne(myQuery);
        return Promise.resolve();
    };

}

namespace DATA {
    export type FieldType = string | number | boolean | object | Date;

    export type Fields = { [key: string]: FieldType }

    export const ReservedSchemaName: string[] = [
        'User',
        'Custom',
        'File'
    ];

    export const FieldTypeList: DATA.FieldType[] = [
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

export default DATA;