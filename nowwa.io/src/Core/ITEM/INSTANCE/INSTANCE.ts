import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import QUERY from "../../../UTIL/QUERY";
import FOLDER from "./FOLDER";
 
class INSTANCE
{
    private static table : string = "item_instances";

    /*=============== 


    GET  
    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        let value = await DATA.get( this.table, query );

        return Promise.resolve( value );
    };

    public static async getOne( query:any ) : Promise<any>
    {
        let value = await DATA.getOne( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    SET  
    
    {
        avatarID,
        itemID,
        folderID
    }

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        query           = QUERY.set( query );

        let folderID    = query.values.folderID;
        let avatarID    = query.values.avatarID;

        if( !folderID )
        {
            let folder  = await FOLDER.getOne( { avatarID:avatarID, type:"root" } );
            folderID    = folder._id;
        }

        let value       = await DATA.set( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any ) : Promise<any>
    {
        let value = await DATA.change( this.table, query );

        return Promise.resolve( value );
    };

    public static async reparent( folderID:any, parentID:any ) : Promise<any>
    {
        return this.change({ value:{ folderID:parentID }, where:{ folderID:folderID } });
    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query:any ) : Promise<any>
    {
        let remove = await DATA.remove( this.table, query );

        // REMOVE TAGS!

        return Promise.resolve( remove );
    };
 
};

export default INSTANCE;