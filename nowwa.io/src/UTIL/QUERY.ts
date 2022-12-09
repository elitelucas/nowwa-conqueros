import mongoose from "mongoose";
import DATE from "./DATE";

class QUERY 
{
    public static get( vars:any ) 
    {
        vars = vars.where ? vars : { where: vars };

        this.fixIDs( vars.where );
        
        return vars;
    };
 
    public static set( vars:any ) 
    {
        let query: any = vars.values ? vars : { values: vars };
        if( query.values._id ) delete ( query.values._id );

        this.fixIDs( query.where );
        this.fixIDs( query.values );

        if( !query.values.timestamp ) query.values.timestamp = DATE.now();
 
        return query;
    };
 
    public static change( vars: any ) 
    {
        let query: any = vars.values ? vars : { values: vars };
        if (query.values._id) delete ( query.values._id );

        this.fixIDs( query.where );
        this.fixIDs( query.values );

        if (!query.values.lastChange) query.values.lastChange = DATE.now();

        return query;
    };


    public static toObjectID( value:any )
    {
        if( Array.isArray( value ) ) 
        {
            for( let n in value ) if( typeof value[n] == "string" ) value[n] = new mongoose.Types.ObjectId( value[n] );
            return value;
        }
                 
        if( typeof value == "string" ) return new mongoose.Types.ObjectId( value );
 
        return value;
    };

    public static fixIDs( vars?:any ) : any
    {
        if( !vars ) return;

        for( var varName in vars ) if( varName == "_id" || varName.includes( "ID" ) )
        {
            vars[ varName ] = this.toObjectID( vars[ varName ] );
        }

        return vars;
    }


}

export default QUERY;