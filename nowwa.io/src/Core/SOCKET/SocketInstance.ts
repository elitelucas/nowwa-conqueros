
import { Socket } from "socket.io"
import CRYPT from "../../UTIL/CRYPT";
import LOG, { log } from "../../UTIL/LOG";
import FILE from "../CMS/FILE";
import AUTH from "../USER/AUTH/AUTH";
import FRIENDS from "../USER/TRIBE/FRIENDS/FRIENDS";
import ROOM from "./ROOM/ROOM";
class SocketInstance 
{
    // Todo, destroy instances on disconnect

    public socket   : Socket;
    public id       : any;
    public User     : any;
    public rooms    : any = {};

    constructor( socket:Socket ) 
    {
        this.socket = socket;
        this.id     = socket.id;

        // log("[SERVER]: New SOCKET instance", this.id);

        this.socket.on( 'action', this.onAction.bind(this) );
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
        
        /*

        socket.join(room);

        if( action == "ROOM.join" )         return joinRoom( vars );
        if( action == "ROOM.leave" )        return leaveRoom( vars );
        if( action == "ROOM.send" )         return leaveRoom( vars );
        */

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

            if( action == "ROOM.getOne" )

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


        /*

        function joinRoom( vars:any )
        {

        }

        function leaveRoom( vars:any )
        {

        }*/
 
    }
 

    public onDisconnect() 
    {
        this.User = {};
        // log("[SERVER] socket disconnected", this.id);
    }

    /*     

    io.on( "connection", (socket) => 
    {
        log("SOCKET onConnection", socket.id );

        socket.emit("noArg");
  
        // works when sending to all
        io.emit("noArg");
    
        // works when broadcasting to a room
        io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));

        socket.on( 'fromClient', (args:any) => 
        {
            log( `[socket] [client:${socket.id}]: ${JSON.stringify(args)}`); 
            // send echo
            socket.emit('fromServer', args);
            socket.broadcast.emit('fromServer', `[broadcast: ${socket.id}]: ${JSON.stringify(args)}`); // sender does not get the broadcast
        });
 
    });
    */

}

export default SocketInstance;