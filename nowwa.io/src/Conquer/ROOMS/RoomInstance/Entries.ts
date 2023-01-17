import { ACTIONS } from "../../../Models/ENUM";
import CONQUER from "../../CONQUER";
import RoomInstance from "./RoomInstance";

class Entries
{
    private conquer: CONQUER;
    private roomInstance    : RoomInstance;
    private roomID          : any;

    constructor( instance:CONQUER, roomInstance:RoomInstance )
    {
        this.conquer = instance;
        this.roomInstance   = roomInstance;
        this.roomID         = roomInstance.roomID;
    }
 
    public async get( vars:any ) : Promise<any>
    {
        vars        = vars || {};
        vars.roomID = this.roomID;

        let values : any = await this.conquer.do( ACTIONS.ROOM_ENTRIES_GET, vars );
 
        return Promise.resolve(  values );
    };

    public set( text:any )
    {
        this.roomInstance.entry( text );
    }

    public async change( vars:any ) : Promise<any>
    {
        let value : any = await this.conquer.do( ACTIONS.ROOM_ENTRIES_CHANGE, vars );
 
        return Promise.resolve( value ); 
    }

    public async remove( vars:any ) : Promise<any>
    {
        await this.conquer.do( ACTIONS.ROOM_ENTRIES_REMOVE, vars );
 
        return Promise.resolve(); 
    }
 

}

export default Entries;