
import { Socket } from "socket.io"
import { ACTIONS } from "../../Models/ENUM";
import CRYPT from "../../UTIL/CRYPT";
import LOG, { log } from "../../UTIL/LOG";
import FILE from "../CMS/FILE";
import GameRoomInstance from "../GAME/GAMEROOM/GameRoomInstance";
import AUTH from "../USER/AUTH/AUTH";
import FRIENDS from "../USER/TRIBE/FRIENDS/FRIENDS";
import ROOM from "./ROOM/ROOM";
import ROOM_ENTRIES from "./ROOM/ROOM_ENTRIES";
class SocketInstance 
{
    // Todo, destroy instances on disconnect

    public static gameRooms : any = {};

    public socket           : Socket;
    public id               : any;
    public User             : any;
    public myGameRooms      : any = {};
 
    constructor( socket:Socket ) 
    {
        this.socket = socket;
        this.id     = socket.id;

        // log("[SERVER]: New SOCKET instance", this.id);

        this.socket.on( 'action', this.onAction.bind(this) );
        this.socket.on( 'message', this.onMessage.bind(this) );
        this.socket.on( "disconnect", this.onDisconnect.bind(this) );
    };

    public onAction( action:any, vars?: any, callback?: Function ) 
    {
        log( "[SERVER]: client action requested", action );

        let self = this;

        // Register and login
        
        if( action == "AUTH.set" )              return map( AUTH.set( vars ) );
        if( action == "AUTH.get" )              return map( AUTH.get( vars ) );

        if( action == "FILE.get" )              return map( FILE.get( vars ) );

        if( action == "ROOM.get" )              return map( ROOM.get( vars ) );
        if( action == "ROOM.getOne" )           return map( ROOM.get( vars ) );

        if( action == "ROOM_ENTRIES.get" )      return map( ROOM_ENTRIES.get( vars ) );  

        if( action == "FRIENDS.change" )        return map( FRIENDS.change( vars ) );
        if( action == "FRIENDS.remove" )        return map( FRIENDS.remove( vars ) );

        vars.avatarID = this.User.avatarID;

        if( action == "ROOM_ENTRIES.set" )      return map( ROOM_ENTRIES.set( vars ) ); 
        if( action == "ROOM_ENTRIES.change" )   return map( ROOM_ENTRIES.change( vars ) );  
        if( action == "ROOM_ENTRIES.remove" )   return map( ROOM_ENTRIES.remove( vars ) );  
 
        if( action == "FILE.set" )              return map( FILE.set( vars ) );
   
        if( action == "FRIENDS.set" )           return map( FRIENDS.set( vars ) );
        if( action == "FRIENDS.get" )           return map( FRIENDS.get( vars ) );
 
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

            if( !SocketInstance.gameRooms[ roomID ] ) SocketInstance.gameRooms[ roomID ] = new GameRoomInstance({ roomID:roomID });

            let gameRoom : GameRoomInstance     = SocketInstance.gameRooms[ roomID ];

            this.myGameRooms[ roomID ]          = true;
 
            message.avatarID                    = this.User.avatarID;

            if( message.action == ACTIONS.PLAYERJOIN ) 
            {
                this.socket.join( roomID );
                message.data = this.User;
            }

            if( message.action == ACTIONS.PLAYERLEFT ) return this.leaveRoom( roomID );

            gameRoom.onMessage( message );
        }
    };
  
    public onDisconnect() 
    {
        this.leaveRoom();
        this.User = {};
    }

    public leaveRoom( roomID?:any )
    {
        if( !roomID )
        {
            for( let roomID in this.myGameRooms ) this.leaveRoom( roomID );
            return;
        }

        this.socket.leave( roomID );

        let gameRoom : GameRoomInstance;

        let message = { action:ACTIONS.PLAYERLEFT, avatarID:this.User.avatarID };
        gameRoom    = SocketInstance.gameRooms[ roomID ];

        delete this.myGameRooms[ roomID ];
        gameRoom.onMessage( message );
    }
 
}

export default SocketInstance;