import CONQUER from "../../CONQUER";
import RoomInstance from "./RoomInstance";

class Entries
{
    private roomInstance    : RoomInstance;
    private roomID          : any;

    constructor( roomInstance:RoomInstance )
    {
        this.roomInstance   = roomInstance;
        this.roomID         = roomInstance.roomID;
    }
 
    public async get( vars:any ) : Promise<any>
    {
        vars        = vars || {};
        vars.roomID = this.roomID;

        let values : any = await CONQUER.do( "ROOM_ENTRIES.get", vars );
 
        return Promise.resolve(  values );
    };

    public set( text:any )
    {
        this.roomInstance.entry( text );
    }

    public async change( vars:any ) : Promise<any>
    {
        let value : any = await CONQUER.do( "ROOM_ENTRIES.change", vars );
 
        return Promise.resolve( value ); 
    }

    public async remove( vars:any ) : Promise<any>
    {
        await CONQUER.do( "ROOM_ENTRIES.remove", vars );
 
        return Promise.resolve(); 
    }
 

}

export default Entries;