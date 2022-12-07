import CONQUER from "../CONQUER";

class RoomInstance
{
    public roomID       : any;
    public name         : any;
    public avatarIDs    : any;

    constructor( vars:any )
    {
        this.roomID     = vars._id;
        this.name       = vars.name;
        this.avatarIDs  = vars.avatarIDs;
    }

    public leave()
    {
        CONQUER.Rooms.leave( this );
    };

    public send( text:string )
    {
        this.do( "ROOM.send", { message:text } );
    }

    public call( signal:any )
    {
        this.do( "ROOM.call", { signal:signal } );
    }

    public accept()
    {
        this.do( "ROOM.accept" );
    }

    public reject()
    {
        this.do( "ROOM.reject" );
    }

    private do( action:string, vars?:any )
    {
        if( !vars ) vars    = {};
        vars.roomID         = this.roomID;

        CONQUER.do( action, vars );
    }
}

export default RoomInstance;