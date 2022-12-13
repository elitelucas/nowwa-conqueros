import TRIBE from "../TRIBE/TRIBE";
import TRIBE_MEMBERS from "../TRIBE/TRIBE_MEMBERS";
import AVATAR from "../AVATAR";
import LOG, {log} from "../../../../UTIL/LOG";
import ARRAY from "../../../../UTIL/ARRAY"; 

class FOLLOWERS
{
    public static table : string = "followers";

   /*=============== 


    GET  
    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        // Mask only avatarIDs

        let tribe : any         = await TRIBE.getOne({ domainID:query.avatarID, type:"followers" });
        var memberships         = await TRIBE_MEMBERS.get({ tribeID:tribe._id });
        let followers : any     = []

        for( var n in memberships )
        {
            let membership  : any = memberships[n];

            if( membership.hidden ) continue;

            let avatar      : any = await AVATAR.getOne({ _id:membership.avatarID });
 
            followers.push(
            {
                avatarID        : avatar._id,
                firstName       : avatar.firstName,
                userPhoto       : avatar.userPhoto,
 
                membershipID    : membership._id,
                status          : membership.status,
                role            : membership.role,
                tribeID         : membership.tribeID
            });
        }

        followers = ARRAY.sort( followers, "firstName" );

        followers.reverse();
 
        return Promise.resolve( followers );
    };
 
    /*=============== 


    SET( REQUEST TO JOIN )
    
    {
        name,
        type,
        private (boolean)

    }
    
    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let tribe : any     = await TRIBE.getOne({ domainID:query.toFollowID, type:"followers" });
 
        var membership      = await TRIBE_MEMBERS.getSet(
        {
            status      : "active",
            tribeID     : tribe._id,
            avatarID    : query.avatarID,
            role        : 1
        });
 
        return Promise.resolve( membership );
    };


  

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query:any ) : Promise<any>
    {
        await TRIBE_MEMBERS.remove({ _id:query.membershipID });
 
        return Promise.resolve();
    };
};

export default FOLLOWERS;