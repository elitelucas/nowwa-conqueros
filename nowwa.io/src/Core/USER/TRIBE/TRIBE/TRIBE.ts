import DATA from "../../../DATA/DATA";
import LOG, { log } from "../../../../UTIL/LOG";
import TRIBE_MEMBERS from "./TRIBE_MEMBERS";
class TRIBE
{
    private static table : string = "tribes";

    /*=============== 


    GET  
    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        let value = await DATA.get( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    GET ONE

    {
        avatarIDs?[] ( used for specific context switching )
    }
    

    ================*/

    public static async getOne( query:any ) : Promise<any>
    {
        let avatarIDs       = query.avatarIDs;

        if( !avatarIDs )
        {
            let value = await DATA.getOne( this.table, query );
            return Promise.resolve( value );
        }

        query.avatarIDs = { $all:avatarIDs, $size:avatarIDs.length }
 
        let value       = await DATA.getOne( this.table, query ); 

        return Promise.resolve( value );
    };

    /*=============== 


    SET  
    
    {
        name,
        type,
        domainID,
        private (boolean) 

    }
    
    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let avatarIDs = query.avatarIDs;
        delete query.avatarIDs;
  
        let tribe = await DATA.set( this.table, query );

        for( let n in avatarIDs )
        {
            await TRIBE_MEMBERS.set(
            { 
                tribeID     : tribe._id,
                avatarID    : avatarIDs[n],
                status      : "active",
                role        : 0
            });
        }

        return Promise.resolve( tribe );
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any ) : Promise<any>
    {
        let value = await DATA.change( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query:any ) : Promise<any>
    {
        let remove = await DATA.remove( this.table, query );
        
        // REMOVE MEMBERS
        
        return Promise.resolve( remove );
    };
 
};

export default TRIBE;