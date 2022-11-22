import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import ROOM_ENTRIES from "./ROOM_ENTRIES";
import TRIBE from "../../USER/TRIBE/TRIBE/TRIBE";
import TRIBE_MEMBERS from "../../USER/TRIBE/TRIBE/TRIBE_MEMBERS";
 
class ROOM_MEMBERS
{
 
    /*=============== 


    GET  
 

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        let tribe = await TRIBE.getOne( { domainID:query.roomID } );
        return TRIBE_MEMBERS.get({ where:{ tribeID:tribe._id }, values:query.values }); 
    };
 
    /*=============== 


    SET  

    {
        avatarID,
        roomID,
        role : 0 Admin, 1 visitor
    }
  
    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let tribe = await TRIBE.getOne( { domainID:query.roomID } );

        delete query.roomID;

        return TRIBE_MEMBERS.set({ where:{ tribeID:tribe._id }, values:query.values }); 
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any ) : Promise<any>
    {
        return TRIBE_MEMBERS.change({ where:{ _id:query.membershipID }, values:query.values }); 
    };

    /*=============== 


    REMOVE  
    
    {
        membershipID,
        deleteEntries
    }

    ================*/

    public static async remove( query:any ) : Promise<any>
    {
        let vars = { _id:query.membershipID };
 
        if( query.deleteEntries )
        {
            let membership  = await TRIBE_MEMBERS.getOne( vars );
            let tribe       = await TRIBE.getOne({ _id:membership.tribeID });

            await ROOM_ENTRIES.remove({ roomID:tribe.domainID, avatarID:membership.avatarID });
        } 
 
        return TRIBE_MEMBERS.remove( vars ); 
    };
 
};

export default ROOM_MEMBERS;