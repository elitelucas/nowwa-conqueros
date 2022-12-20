import CONQUER from "../../CONQUER";
import { STATUS, ACTIONS } from "../../../Models/ENUM";
import Entries from "./Entries";

class RoomInstance
{
    private conquer     : CONQUER;
    public roomID       : any;
    public name         : any;
    public avatarIDs    : any;
    public onMessage    : Function = function(e:any){};
    public data         : any = {};

    public Entries      : Entries;


    /*
 
    conquer.Avatars.get().then( array ){} <--- for now this has all of the users registered 

    conquer.Rooms.get( { avatarIDs:[myID, yourID] } ).then( function( roomInstance )
    {
        roomInstance.onMessage = function( message )
        {
            log("DO something with that message now!", message );
        }

        roomInstance.join().then( function()
        {   
            roomInstance.Entries.get().then( function(array)
            {
                // put this on the website
            }) // you get all of the entries sent previously in the chat 


            roomInstance.chat("sending this text");
            roomInstance.entry("this text gets recorded to the database");

            roomInstance.call( YOUR_SIGNAL ); // you're calling the room
            
            roomInstance.reject();
        });

        // I WANT TO GET THE PAST ENTRIES OF THE CONVERSATION


    });



    */
    constructor( instance:CONQUER, vars:any )
    {
        this.conquer    = instance;
        this.roomID     = vars._id;
        this.name       = vars.name;
        this.avatarIDs  = vars.avatarIDs;

        this.Entries    = new Entries( this.conquer, this );
    }

    public join()
    {
        this.doSend( ACTIONS.PLAYERJOIN );
    };

    public leave()
    {
        this.conquer.Rooms.leave( this );
    };

    public chat( text:any )
    {
        this.doSend( ACTIONS.CHAT, text );
    }

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
        this.conquer.send( action, this.roomID, data || {} );
    }

    public _onServerMessage( message:any )
    {
        let action = message.action;

        if( action == ACTIONS.GAMEDATA ) this.data = message.data;

        this.onMessage( message );
    }
}

export default RoomInstance;