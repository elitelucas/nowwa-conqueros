import mongoose, { mongo } from 'mongoose';
import Environment from '../CONFIG/Environment';
import { Custom, CustomProperty, CustomType, CustomDocument } from '../../Models/Custom';
import DB from './DB';
import LOG, { log, error } from '../../UTIL/LOG';

 
class DBTABLE
{

    private static pool:{[key:string]:CustomType} = {};

    /*=============== 


    GET
    

    ================*/

    public static async get( tableName:string ):Promise<CustomType> 
    {
        if( DBTABLE.pool[ tableName ] ) return DBTABLE.pool[ tableName ];

        let query;
 
        let $or:{[key:string]:any}[] = [];

        $or.push(
        {
            [ `${ CustomProperty.schemaName }` ]  : tableName
        });

        query = Custom.find(
        {
            $or: $or 
        });
 
        query.select( `${ CustomProperty.schemaName } ${ CustomProperty.schemaFields }` );

        let data = await query.exec();

        if( !data.length ) return Promise.reject( new Error(`schema '${tableName}' not found!`));

        var schema = DBTABLE.pool[ tableName ] = 
        {
            schemaName      : data[0].schemaName,
            schemaFields    : data[0].schemaFields
        };

        return Promise.resolve( schema );
    }

    /*=============== 


    SET
    

    ================*/

    public static async set( name:string, query:DB.Query ):Promise<CustomType> 
    {

        if( DB.ReservedSchemaName.includes( name )) throw new Error(`schema name '${ name }' is not allowed!`);
 
        let finalFields     : DB.Fields    = {...query.add};
        let finalFieldNames : string[]          = Object.keys( finalFields );

        for( let i:number = 0; i < finalFieldNames.length; i++ ) 
        {
            let finalFieldName : string         = finalFieldNames[i];
            let finalFieldType : DB.FieldType   = finalFields[ finalFieldName ];

            if( DB.FieldTypeList.indexOf( finalFieldType ) < 0 ) throw new Error( `field '${ finalFieldName }' has an invalid type of '${finalFieldType}'!` );
        }

        let originalFilter : CustomType = 
        {
            schemaName      : name
        };

        let myQuery         = Custom.findOne( originalFilter );
        var table           = await myQuery.exec();

        if( !table )
        {
            table = await Custom.create(
            {
                schemaName      : name,
                schemaFields    : finalFields 
            });

            return Promise.resolve(
            {
                schemaName      : name,
                schemaFields    : table.schemaFields
            });
        }
 
        finalFields = 
        {
            ...table.schemaFields,
            ...finalFields 
        };

        if( query.remove ) 
        {
            for( let i = 0; i < query.remove.length; i++ ) 
            {
                let schemaFieldName = query.remove[i];
                delete finalFields[ schemaFieldName ];
 
            }
        }
        
        table.schemaFields  = finalFields;

        table.markModified( CustomProperty.schemaFields );

        table               = await table.save();

        return Promise.resolve(
        {
            schemaName      : name,
            schemaFields    : table.schemaFields
        });
    }

    /*=============== 


    CHANGE
    

    ================*/
 
    public static async change()
    {

    };

    /*=============== 


    REMOVE
    

    ================*/
 
    public static async remove()
    {

    };
}

 

export default DBTABLE;