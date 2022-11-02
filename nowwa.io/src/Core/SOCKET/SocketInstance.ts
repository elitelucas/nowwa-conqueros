import { Socket } from "socket.io"
import LOG, { log } from "../../UTIL/LOG";
import AUTH from "../USER/AUTH/AUTH";

class SocketInstance
{
    // Todo, destroy instances on disconnect

    public socket   : Socket;
    public id       : any;

    constructor( socket:Socket )
    {
        this.socket = socket;
        this.id     = socket.id;

        log( "[SERVER]: New SOCKET instance", this.id ); 

        this.socket.on( 'action', this.onAction.bind( this ) );
        this.socket.on( "disconnect", this.onDisconnect.bind( this ) ); 
    };

    public onAction( action:string, vars?:any, callback?:Function )
    {
        log( "[SERVER]: client action requested", action );

        if( action == "AUTH.set" ) return AUTH.set( vars ).then( doCallback ); 
 
        function doCallback( vars:any )
        {
            if( callback ) callback( vars );
        }
    }

 
    public onDisconnect()
    {
        log("[SERVER] socket disconnected", this.id );
    }
 
    /*     

    io.on( "connection", (socket) => 
    {
        log("SOCKET onConnection", socket.id );

        socket.emit("noArg");
        socket.emit("basicEmit", 1, "2", Buffer.from([3]));

        socket.emit("withAck", "4", (e:any) => 
        {
            log(`e: ${e}`);
        });
    
        // works when broadcast to all
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

        socket.on( 'login', (args:Authentication.Input) => 
        {
            Authentication.Login(args).then((user) => 
            {
                socket.to(socket.id).emit('fromServer', { success: true, value: user });

            }).catch((error) => 
            {
                socket.emit('fromServer', { success: false, error: error.message || error });
            });
        });
 
    });
    */
 
}

export default SocketInstance;