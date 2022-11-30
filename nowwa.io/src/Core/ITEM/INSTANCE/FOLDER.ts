import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import INSTANCE from "./INSTANCE";
import ARRAY from "../../../UTIL/ARRAY";
 
class FOLDER
{
    private static table: string = "folders";

    /*=============== 


    GET  
    

    ================*/

    public static async get( query: any ) : Promise<any>
    {
        let value = await DATA.get( this.table, query );

        return Promise.resolve( value );
    };

    public static async getOne( query: any ) : Promise<any>
    {
        let value = await DATA.getOne( this.table, query );
        return Promise.resolve( value );
    };

    public static async getChildren( folderID:any, isRecursive?:boolean, f?:any, i?:any ) : Promise<any>
    {
        let folders     = await this.get({ folderID:folderID });
        let instances   = await INSTANCE.get({ folderID:folderID });

        if( isRecursive )
        {
            for( var n in folders ) await this.getChildren( folders[n]._id, isRecursive, folders, instances );
    
            if( f ) ARRAY.pushUnique( f, folders );
            if( i ) ARRAY.pushUnique( i, instances );
        }
 
        return Promise.resolve({ folders:folders, instances:instances });
    };

 
    /*=============== 


    SET  

    {
        name,
        type,
        folderID (parent folder)
    }
    

    ================*/

    public static async set( query: any ) : Promise<any>
    {
        let value = await DATA.set( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query: any ) : Promise<any>
    {
        let value = await DATA.change( this.table, query );

        return Promise.resolve( value );
    };

    public static async reparent( folderID: any, parentID:any ) : Promise<any>
    {
        return this.change({ value:{ folderID:parentID }, where:{ folderID:folderID } });
    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query:any ) : Promise<any>
    {
        var results     : any = DATA.get( this.table, query );
        var folders     : any = [];
        var instances   : any = [];

        for( let n in results )     await this.getChildren( results[n]._id, true, folders, instances );
        for( let n in folders )     await DATA.remove( this.table, { _id:folders[n]._id });
        for( let n in instances )   await INSTANCE.remove({ _id:instances[n]._id });
 
        return Promise.resolve();
    };
 
};

export default FOLDER;