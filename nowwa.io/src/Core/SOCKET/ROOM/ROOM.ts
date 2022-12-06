import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import ROOM_ENTRIES from "./ROOM_ENTRIES";
import TRIBE from "../../USER/TRIBE/TRIBE/TRIBE";
import TRIBE_MEMBERS from "../../USER/TRIBE/TRIBE/TRIBE_MEMBERS";
 
class ROOM
{
    private static table: string = "rooms";

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

        if( !avatarIDs ) 
        {
            let value = await DATA.getOne( this.table, query );
            return Promise.resolve( value );
        }

        let tribe = await TRIBE.getOne({ avatarIDs:avatarIDs, type:"room" });

        if( tribe ) DATA.getOne( this.table, { _id:tribe.domainID } );

        return this.set({ avatarIDs:avatarIDs });
    };

    /*=============== 


    SET  

    {
        name?,
        avatarIDs?:[],
        capacity?,
        length
    }
 
    ================*/

    public static async set( query:any ) : Promise<any>
    {
        query.length        = 0;
        query.name          = query.name || "Room";
        let avatarIDs       = query.avatarIDs;

        delete query.avatarIDs;
 
        let room            = await DATA.set( this.table, query );

        let roomID          = room._id;

        let tribe           = await TRIBE.set(
        {
            domainID    : roomID,
            type        : "room",
            avatarIDs   : avatarIDs 
        });

        await this.change({ where:{ _id:roomID }, values:{ tribeID:tribe._id } });
 
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

        for( let n in results ) 
        {
            let roomID = results[n]._id;

            await ROOM_ENTRIES.remove({ roomID:roomID });
            await TRIBE.remove({ domainID:roomID });
        }
 
        let removed     = await DATA.remove( this.table, query );

        return Promise.resolve( removed );
    };
 
};

export default ROOM;