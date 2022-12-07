import io from 'socket.io-client';
import CONFIG from '../../Core/CONFIG/CONFIG';
import LOG, { log } from '../../UTIL/LOG';
import CONQUER from '../CONQUER';
 
class Socket
{
    // USE THIS FOR LOCAL TEST
    private socketHost: string = '127.0.0.1';
    private socketPort: number = 9003;
    private get socketUseSSL() { return false; }

    // USE THIS FOR LIVE SERVER
    // private socketHost: string = 'nowwa.io';
    // private socketPort: number =  = 9005;
    // private get socketUseSSL() { return true; }

    private get socketProtocol()    : string { return this.socketUseSSL ? 'https' : 'http'; }
    private get socketPortFinal()   : string { return (this.socketPort == 80 && !this.socketUseSSL) || (this.socketPort == 443 && this.socketUseSSL) ? `` : `:${this.socketPort.toString()}`; };
    private get socketURL()         : string { return `${this.socketProtocol}://${this.socketHost}${this.socketPortFinal}`; }

    private socket?                 : any;
    private id                      : any;

    public async init() : Promise<any>
    {
        log( "client: Init New Socket Client" );
        var wut = await this.connect();

        return Promise.resolve("SAY "+wut);
    }
 
    private async connect() : Promise<any>
    {
        log( "client: Socket Connect" );

        var self    = this;
        // var socket  = self.socket = io( self.socketURL );
        var socket  = self.socket = io( CONFIG.vars.PUBLIC_SOCKET_FULL_URL );

        socket.on( "disconnect", () => 
        {
            log( `client: connect status: ${ socket.connected }` );
            self.connect();
        }); 

        socket.on( 'message', CONQUER.Rooms._onServerMessage );
 
        return new Promise((resolve) => 
        {
            socket.on( "connect", () => 
            {
                self.id = socket.id;
                resolve( self.id );
            });
        });
 
      //  return Promise.resolve("OK I SEE");
    }

    public async do( action:string, vars?:any ) : Promise<any>
    {
        return new Promise( resolve => this.socket.emit( "action", action, vars, resolve ) ); 
    }

    public disconnect() 
    {
        this.socket.disconnect(); 
    }
 
};

export default Socket;