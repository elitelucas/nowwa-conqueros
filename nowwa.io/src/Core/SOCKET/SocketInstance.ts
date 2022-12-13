 
import { Socket } from "socket.io"
import { ACTIONS } from "../../Models/ENUM";
import CRYPT from "../../UTIL/CRYPT";
import LOG, { log } from "../../UTIL/LOG";
import QUERY from "../../UTIL/QUERY";
import FILE from "../CMS/FILE";
import GameRoomInstance from "../GAME/GAMEROOM/GameRoomInstance";
import AUTH from "../USER/AUTH/AUTH";
import FRIENDS from "../USER/TRIBE/FRIENDS/FRIENDS";
import ROOM from "./ROOM/ROOM";
import ROOM_ENTRIES from "./ROOM/ROOM_ENTRIES";
import ARRAY, { extract } from "../../UTIL/ARRAY";
import ANALYTICS from "../ANALYTICS/ANALYTICS";
import FOLLOWERS from "../USER/TRIBE/FRIENDS/FOLLOWERS";
import GAME from "../GAME/GAME";
import GAMESCORE from "../GAME/GAMESCORE";
import GAMETURN from "../GAME/GAMETURNS/GAMETURN";
class SocketInstance 
{
    // Todo, destroy instances on disconnect

    // OUR ROOM [ myAvatarID, yourAvatarID ] 

    public static gameRooms : any = {};

    public socket           : Socket;
    public socketID         : any;
    public User             : any = {};
    public myGameRooms      : any = {};
 
    constructor( socket:Socket ) 
    {
        this.socket = socket;
        this.socketID     = socket.id;

        // log("[SERVER]: New SOCKET instance", this.id);

        this.socket.on( 'action', this.onAction.bind(this) );
        this.socket.on( 'message', this.onMessage.bind(this) );
        this.socket.on( "disconnect", this.onDisconnect.bind(this) );
    };

    public onAction( action:any, vars?: any, callback?: Function ) 
    {
        log( "[SERVER]: client action requested", action );

        vars        = vars || {};
        let self    = this;

        // Register and login
        
        if( action == ACTIONS.AUTH_SET )                return map( AUTH.set( vars ) );
        if( action == ACTIONS.AUTH_GET )                return map( AUTH.get( vars ) );

        if( action == ACTIONS.FILE_GET)                 return map( FILE.get( vars ) );

        if( action == ACTIONS.ROOM_GET )                return map( ROOM.get( vars ) );

        if( action == ACTIONS.ROOM_ENTRIES_GET )        return map( ROOM_ENTRIES.get( vars ) );  

        if( action == ACTIONS.FRIENDS_CHANGE )          return map( FRIENDS.change( vars ) );
        if( action == ACTIONS.FRIENDS_REMOVE )          return map( FRIENDS.remove( vars ) );
        if( action == ACTIONS.ANALYTICS_GET )           return map( ANALYTICS.get( vars ) );

        if( action == ACTIONS.GAME_GETONE )             return map( GAME.getOne( vars ) );

        if( action == ACTIONS.GAMESCORE_GETALLTIME )    return map( GAMESCORE.getAllTime( vars ) );
        if( action == ACTIONS.GAMESCORE_GETTODAY )      return map( GAMESCORE.getToday( vars ) );

        if( action == ACTIONS.GAMETURN_GETONE )         return map( GAMETURN.getOne( vars ) );
 
        vars.avatarID = this.User.avatarID;

        if( action == ACTIONS.GAMESCORE_SET )                   return map( GAMESCORE.set( vars ) );
        if( action == ACTIONS.GAMESCORE_GETFRIENDSALLTIME )     return map( GAMESCORE.getFriendsAllTime( vars ) );
        if( action == ACTIONS.GAMESCORE_GETFRIENDSTODAY )       return map( GAMESCORE.getFriendsToday( vars ) );

        if( action == ACTIONS.GAMETURN_GET )            return map( GAMETURN.get( vars ) );
        if( action == ACTIONS.GAMETURN_SET )            return map( GAMETURN.set( vars ) );
        if( action == ACTIONS.GAMETURN_CHANGE )         return map( GAMETURN.change( vars ) );

        if( action == ACTIONS.ANALYTICS_SET )           return map( ANALYTICS.set( vars ) );

        if( action == ACTIONS.FOLLOWERS_SET )           return map( FOLLOWERS.set( vars ) );
        if( action == ACTIONS.FOLLOWERS_GET )           return map( FOLLOWERS.get( vars ) );

        if( action == ACTIONS.ROOM_GETONE )             return map( ROOM.getOne( vars ) );

        if( action == ACTIONS.ROOM_ENTRIES_SET )        return map( ROOM_ENTRIES.set( vars ) ); 
        if( action == ACTIONS.ROOM_ENTRIES_CHANGE )     return map( ROOM_ENTRIES.change( vars ) );  
        if( action == ACTIONS.ROOM_ENTRIES_REMOVE )     return map( ROOM_ENTRIES.remove( vars ) );  
 
        if( action == ACTIONS.FILE_SET )                return map( FILE.set( vars ) );
   
        if( action == ACTIONS.FRIENDS_SET )             return map( FRIENDS.set( vars ) );
        if( action == ACTIONS.FRIENDS_GET )             return map( FRIENDS.get( vars ) );
 
        doError();

        function doCallback( vars?: any, isSucess: boolean = true ) 
        {
            if( action == ACTIONS.AUTH_GET && isSucess && vars ) setUser( vars );
 
            if( callback ) callback( vars || isSucess );
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

            vars.socketID = self.socketID; 
            extract( vars, self.User );
            delete self.User.token;
        }
 
    }

    public onMessage( messages:any ) 
    {
        for( var n in messages )
        {
            let message                         = messages[n];//QUERY.fixIDs(  );
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