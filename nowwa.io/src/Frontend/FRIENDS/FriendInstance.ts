import ARRAY from "../../UTIL/ARRAY";
import CONQUER from "../CONQUER";

class FriendInstance
{
    public avatarID     : any;
    public firstName    : any;
    public userPhoto    : any;
    public membershipID : any;
    public status       : any;
    public role         : any;
 
    constructor( vars:any )
    {
        this.avatarID       = vars.avatarID;
        this.firstName      = vars.firstName;
        this.userPhoto      = vars.userPhoto;

        this.membershipID   = vars.membershipID;
        this.status         = vars.status;
        this.role           = vars.role;
    };

    public async accept() : Promise<any>
    {
        if( this.role != "invited" ) return;

        var membership  = await CONQUER.do( "FRIENDS.change", { membershipID:this.membershipID, status:"active" } );
        this.status     = membership.status;

        return Promise.resolve( this );
    }

    public remove()
    {
        CONQUER.do("FRIENDS.remove", { membershipID:this.membershipID });
        ARRAY.removeItem( CONQUER.Friends.pool, this );
    }
 
}

export default FriendInstance;