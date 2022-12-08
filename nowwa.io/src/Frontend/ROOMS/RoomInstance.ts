import CONQUER from "../CONQUER";
import { STATUS, ACTIONS } from "../../Models/ENUM";

class RoomInstance
{
    public roomID       : any;
    public name         : any;
    public avatarIDs    : any;
    public onMessage    : Function = function(e:any){};

    constructor( vars:any )
    {
        this.roomID     = vars._id;
        this.name       = vars.name;
        this.avatarIDs  = vars.avatarIDs;
    }

    public join()
    {
        this.doSend( ACTIONS.PLAYERJOIN );
    };

    public leave()
    {
        CONQUER.Rooms.leave( this );
    };

    public entry( text:any )
    {
        this.doSend( ACTIONS.ENTRY, text );
    }

    public call( signal:any )
    {
        this.doSend( ACTIONS.CALL, signal );
    }

    public accept( signal:any )
    {
        this.doSend( ACTIONS.ACCEPT_CALL, signal );
    }

    public reject()
    {
        this.doSend( ACTIONS.REJECT_CALL );
    }

    private doSend( action:any, data?:any )
    {
        CONQUER.send( action, this.roomID, data || {} );
    }

    public _onServerMessage( message:any )
    {
 
        this.onMessage( message );
    }
}

export default RoomInstance;