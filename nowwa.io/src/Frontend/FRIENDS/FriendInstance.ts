import ACCOUNT from "../../Core/TESTS/ACCOUNT";
import { ACTIONS } from "../../Models/ENUM";
import ARRAY from "../../UTIL/ARRAY";
import CONQUER from "../CONQUER";

class FriendInstance
{
    private conquer: CONQUER;
    public avatarID     : any;
    public firstName    : any;
    public userPhoto    : any;
    public membershipID : any;
    public status       : any;
    public role         : any;
 
    constructor( instance:CONQUER, vars:any )
    {
        this.conquer        = instance;

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

        var membership  = await this.conquer.do( ACTIONS.FRIENDS_CHANGE, { membershipID:this.membershipID, status:"active" } );
        this.status     = membership.status;

        return Promise.resolve( this );
    }

    public remove()
    {
        this.conquer.do( ACTIONS.FRIENDS_REMOVE, { membershipID:this.membershipID });
        ARRAY.removeItem( this.conquer.Friends.pool, this );
    }
 
}

export default FriendInstance;