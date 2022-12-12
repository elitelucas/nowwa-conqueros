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

        this.fill( vars );
    };

    private fill( vars:any )
    {
        this.avatarID       = vars.avatarID || this.avatarID;
        this.firstName      = vars.firstName || this.firstName;
        this.userPhoto      = vars.userPhoto || this.userPhoto;

        this.membershipID   = vars.membershipID;
        this.status         = vars.status;
        this.role           = vars.role;
    }

    public async set() : Promise<any>
    {
        let membership;

        if( !this.membershipID )
        {
            membership      = await this.conquer.Friends.set( this.avatarID );

            return Promise.resolve( this );
        } 
 
        if( this.status != "pending" ) return;

        membership      = await this.conquer.do( ACTIONS.FRIENDS_CHANGE, { membershipID:this.membershipID, status:"active" } );
 
        this.fill( membership );

        return Promise.resolve( this );
    }

    public remove()
    {
        this.conquer.do( ACTIONS.FRIENDS_REMOVE, { membershipID:this.membershipID });
        ARRAY.removeItem( this.conquer.Friends.pool, this );
    }
 
}

export default FriendInstance;