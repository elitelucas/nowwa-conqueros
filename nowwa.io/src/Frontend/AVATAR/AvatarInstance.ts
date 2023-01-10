import ACCOUNT from "../../Core/TESTS/ACCOUNT";
import { ACTIONS } from "../../Models/ENUM";
import ARRAY from "../../UTIL/ARRAY";
import CONQUER from "../CONQUER";

class AvatarInstance
{
    private conquer     : CONQUER;
    public avatarID     : any;
    public firstName    : any;
    public userPhoto    : any;

    constructor( instance:CONQUER, vars:any )
    {
        this.conquer        = instance;

        this.fill( vars );
    };

    private fill( vars:any )
    {
        this.avatarID       = vars._id || this.avatarID;
        this.firstName      = vars.firstName || this.firstName;
        this.userPhoto      = vars.userPhoto || this.userPhoto;
    }

    public async set() : Promise<any>
    {
        let membership      = await this.conquer.Friends.set( this.avatarID ); 
        return Promise.resolve( membership );
    }

}

export default AvatarInstance;