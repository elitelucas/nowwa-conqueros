import CONQUER from "../CONQUER";

class RoomInstance
{ 
    private conquer: CONQUER;
    
    public roomID       : any;
    public name         : any;
    public avatarIDs    : any;

    constructor(instance:CONQUER, vars:any )
    {
        this.conquer = instance;
        this.roomID     = vars._id;
        this.name       = vars.name;
        this.avatarIDs  = vars.avatarIDs;
    }

    public leave()
    {
        this.conquer.Rooms.leave( this.roomID );
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

        this.conquer.do( action, vars );
    }
}

export default RoomInstance;