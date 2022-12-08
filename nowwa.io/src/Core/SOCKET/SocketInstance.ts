
import { Socket } from "socket.io"
import CRYPT from "../../UTIL/CRYPT";
import LOG, { log } from "../../UTIL/LOG";
import FILE from "../CMS/FILE";
import GameRoomInstance from "../GAME/GAMEROOM/GameRoomInstance";
import AUTH from "../USER/AUTH/AUTH";
import FRIENDS from "../USER/TRIBE/FRIENDS/FRIENDS";
import ROOM from "./ROOM/ROOM";
class SocketInstance 
{
    // Todo, destroy instances on disconnect

    public static gameRooms : any = {};

    public socket           : Socket;
    public id               : any;
    public User             : any;
 
    constructor( socket:Socket ) 
    {
        this.socket = socket;
        this.id     = socket.id;

        // log("[SERVER]: New SOCKET instance", this.id);

        this.socket.on( 'action', this.onAction.bind(this) );
        this.socket.on( 'message', this.onMessage.bind(this) );
        this.socket.on( "disconnect", this.onDisconnect.bind(this) );
    };

    public onAction( action: string, vars?: any, callback?: Function ) 
    {
        log( "[SERVER]: client action requested", action );

        let self = this;

        // Register and login
        
        if( action == "AUTH.set" )          return map( AUTH.set( vars ) );
        if( action == "AUTH.get" )          return map( AUTH.get( vars ) );

        if( action == "FILE.get" )          return map( FILE.get( vars ) );

        if( action == "ROOM.get" )          return map( ROOM.get( vars ) );
        if( action == "ROOM.getOne" )       return map( ROOM.get( vars ) );
 
        vars.avatarID = this.User.avatarID;
 
        if( action == "FILE.set" )          return map( FILE.set( vars ) );
   
        if( action == "FRIENDS.set" )       return map( FRIENDS.set( vars ) );
        if( action == "FRIENDS.get" )       return map( FRIENDS.get( vars ) );
        if( action == "FRIENDS.change" )    return map( FRIENDS.change( vars ) );
        if( action == "FRIENDS.remove" )    return map( FRIENDS.remove( vars ) );
  
        doError();

        function doCallback( vars?: any, isSucess: boolean = true ) 
        {
            if( action == "AUTH.get" && isSucess && vars ) setUser( vars );
 
            if( callback ) callback({ success: isSucess, result: vars || {} });
        }

        function doError( vars?: any ) 
        {
            doCallback( vars, false);
        }

        function map( promise: any ) 
        {
            promise.then( doCallback ).catch( doError );
        }

        function setUser( vars?:any )
        {
            if( !vars ) return;
            self.User = vars;
        }
 
    }

    public onMessage( messages:any ) 
    {
        for( var n in messages )
        {
            let message                         = messages[n];
            let roomID                          = message.roomID;

            delete message.roomID;

            if( !roomID ) continue;

            if( !SocketInstance.gameRooms[ roomID ] ) SocketInstance.gameRooms[ roomID ] = new GameRoomInstance({ socket:this.socket, roomID:roomID });

            let gameRoom : GameRoomInstance     = SocketInstance.gameRooms[ roomID ];
            message.avatarID                    = this.User.avatarID;

            gameRoom.onMessage( message );
        }
    };
 
 

    public onDisconnect() 
    {
        this.User = {};
        // log("[SERVER] socket disconnected", this.id);
    }
 
}

export default SocketInstance;