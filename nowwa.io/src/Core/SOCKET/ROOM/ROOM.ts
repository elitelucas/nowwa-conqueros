import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import QUERY from "../../../UTIL/QUERY";
import ROOM_ENTRIES from "./ROOM_ENTRIES";

class ROOM
{
    public static pool : any = {};

    private static table : string = "rooms";

    /*=============== 


    GET  
 

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        let value = await DATA.get( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    GET ONE ( used for 'switch context' using avatarIDs ) 
 
    {
        avatarIDs?:[]
    }

    
    ================*/

    public static async getOne( query:any ) : Promise<any>
    {
        let avatarIDs = query.avatarIDs;

        if( avatarIDs ) 
        {
            if( query.avatarID ) avatarIDs.push( query.avatarID )
            delete query.avatarID;

            avatarIDs       = QUERY.toObjectID( avatarIDs );
            query.avatarIDs = { $all:avatarIDs, $size:avatarIDs.length };
        }

        let room = await DATA.getOne( this.table, query );

        if( room ) return Promise.resolve( room );

        if( avatarIDs ) return this.set({ avatarIDs:avatarIDs, name:query.name });
  
        return this.set( query );
    };

    /*=============== 


    SET  

    {
        name?,
        avatarIDs?:[],
        capacity? 
    }
 
    ================*/

    public static async set( query:any ) : Promise<any>
    {
        query.name          = query.name || "Room";
   
        let room            = await DATA.set( this.table, query );
 
        return Promise.resolve( room );
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
        let results     = await DATA.get( this.table, query ); 

        for( let n in results ) await ROOM_ENTRIES.remove({ roomID:results[n]._id });
 
        let removed     = await DATA.remove( this.table, query );

        return Promise.resolve( removed );
    };
 
};

export default ROOM;