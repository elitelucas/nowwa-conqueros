import DATA from "../../../DATA/DATA";
import LOG, { log } from "../../../../UTIL/LOG";
import TRIBE from "../TRIBE/TRIBE";
import TRIBE_MEMBERS from "../TRIBE/TRIBE_MEMBERS";
import AVATAR from "../AVATAR";
import ARRAY from "../../../../UTIL/ARRAY";

class FRIENDS
{
 
    /*=============== 


    GET  
    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        // Mask only avatarIDs

        let tribe : any     = await TRIBE.getOne({ domainID:query.avatarID, type:"friends" });

        var memberships     = await TRIBE_MEMBERS.get({ tribeID:tribe._id });

        let friends : any = []

        for( var n in memberships )
        {
            let membership  : any = memberships[n];

            if( membership.hidden ) continue;

            let avatar      : any = await AVATAR.getOne({ _id:membership.avatarID });
 
            friends.push(
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

        friends = ARRAY.sort( friends, "firstName" );

        friends.reverse();
 
        return Promise.resolve( friends );
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
        // friend
 
        let tribe : any     = await TRIBE.getOne({ domainID:query.friendID, type:"friends" });
 
        let vars : any = 
        {
            status      : "pending",
            tribeID     : tribe._id,
            avatarID    : query.avatarID,
            role        : 1
        }

        var membership      = await TRIBE_MEMBERS.getSet( vars )

        // my tribe

        tribe      = await TRIBE.getOne({ domainID:query.avatarID, type:"friends" });

        vars = 
        {
            status      : "invited",
            tribeID     : tribe._id,
            avatarID    : query.friendID,
            role        : 1
        }

        var membership2      = await TRIBE_MEMBERS.getSet( vars )
 
        return Promise.resolve( membership2 );
    };


    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any ) : Promise<any>
    {
        let status = query.status || "active";

        let vars : any = { status:status };

        var membership = await TRIBE_MEMBERS.change( { where:{ _id:query.membershipID }, values:vars });

        // update friend too
 
        if( status == "active" )
        {
            var tribe = await TRIBE.getOne({ domainID:query.avatarID, type:"friends" });
            TRIBE_MEMBERS.change( { where:{ tribeID:tribe._id, avatarID:query.avatarID, status:"invited" }, values:{ status:"active"} });
        }
        
        return Promise.resolve( membership );
    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query:any ) : Promise<any>
    {
        // remove someone from YOUR FRIENDS

        var membership = await TRIBE_MEMBERS.getOne( { _id:query.membershipID } );
        await TRIBE_MEMBERS.remove({ _id:query.membershipID });

        // remove yourself from THEIR FRIENDS too 

        let theirFriends = await TRIBE.getOne({ domainID:membership.avatarID, type:"friends" });

        await TRIBE_MEMBERS.remove({ tribeID:theirFriends, avatarID:query.avatarID });

        return Promise.resolve();
    };
 
};

export default FRIENDS;