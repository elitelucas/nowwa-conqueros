import { Socket } from "socket.io"
import LOG, { log } from "../../UTIL/LOG";

class SocketInstance
{
    public socket   : Socket;
    public id       : any;

    constructor( socket:Socket )
    {
        this.socket = socket;
        this.id     = socket.id;

        log( "New SOCKET instance", this.id ); 

        this.socket.on( 'action', this.onAction );
    };

    public onAction( action:string, vars?:any, callback?:Function )
    {
        log("client action requested", action );

        if( callback ) callback("server done");
    }
 
}

export default SocketInstance;