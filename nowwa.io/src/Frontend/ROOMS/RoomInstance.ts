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

    public join()
    {
        this.doSend( "ROOM.join", { roomID:this.roomID } );
    };


    public leave()
    {
        CONQUER.Rooms.leave( this );
    };

    public send( text:string )
    {
        this.doSend( "ROOM.send", { message:text } );
    }

    public call( signal:any )
    {
        this.doSend( "ROOM.call", { signal:signal } );
    }

    public accept()
    {
        this.doSend( "ROOM.accept" );
    }

    public reject()
    {
        this.doSend( "ROOM.reject" );
    }

    private doSend( action:string, data?:any )
    {
        CONQUER.send( action, this.roomID, data || {} );
    }
}

export default RoomInstance;