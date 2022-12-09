import io from 'socket.io-client';
import CONFIG from '../../Core/CONFIG/CONFIG';
import TimerInstance from '../../UTIL/Instances/TimerInstance';
import LOG, { log } from '../../UTIL/LOG';
import CONQUER from '../CONQUER';
 
class Socket
{
    private conquer: CONQUER;
    public constructor(instance:CONQUER) {
        this.conquer = instance;
    }

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
    private messagesCue             : any = [];
    private sendTimer               : any;

    public async init() : Promise<any>
    {
        log( "client: Init New Socket Client" );

        let self    = this;

        await this.connect();

        this.sendTimer = new TimerInstance({ onUpdate:function()
        {
            self.doSend();

        }, interval:300, autoStart:true });
 
        return Promise.resolve();
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

        socket.on( 'message', function( obj:any )
        {
            self.conquer.Rooms._onServerMessage( obj );
        });
 
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

    public async do( action:any, data?:any ) : Promise<any>
    {
        return new Promise( resolve => this.socket.emit( "action", action, data, resolve ) ); 
    }

    public send( action:any, roomID:any, data?:any )
    {
        this.messagesCue.push({ action:action, roomID:roomID, data:data } );
    }
 
    private doSend()
    {
        if( !this.messagesCue.length ) return;

        this.socket.emit( "message", this.messagesCue ); 
 
        this.messagesCue = [];
    }


    public disconnect() 
    {
        this.socket.disconnect(); 
    }
 
};

export default Socket;