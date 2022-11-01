import io from 'socket.io-client';
import LOG, { log } from '../UTIL/LOG';
import DATE from '../UTIL/DATE';

class SocketClient
{
    private socketHost              : string = '127.0.0.1';
    // var socketHost = 'nowwa.io';
    private socketPort              : number = 9003;
    // var socketPort = 80;
    private get socketUseSSL() { return false; }
    // var socketUseSSL = true;
    private get socketProtocol()    : string { return this.socketUseSSL ? 'https' : 'http'; }
    private get socketPortFinal()   : string { return (this.socketPort == 80 && !this.socketUseSSL) || (this.socketPort == 443 && this.socketUseSSL) ? `` : `:${this.socketPort.toString()}`; };
    private get socketURL()         : string { return `${this.socketProtocol}://${this.socketHost}${this.socketPortFinal}`; }

    private socket?                 : any;
    private socketListeners         : Map<string, any> = new Map<string, any>();
    private onInitializedCallback   : any;
    private id                      : any;
    private isFirstTime             : boolean = true;

    constructor( callback:Function )
    {
        this.onInitializedCallback = callback;

        log( "New Socket Client" );

        this.connect();
    }
 
    private connect()  
    {
        log( "Socket Connect" );
        
        this.socket = io( this.socketURL );
 
        this.socket.on( "connect", () => 
        {
            this.id = this.socket.id;

            log( "Socket Connected", this.id );
            console.log(`[socket] connect status: ${this.socket.connected}`);

            if( !this.isFirstTime ) return;
            this.isFirstTime = false;

            log("Çlient connected, callback" );

            this.onInitializedCallback();

            this.socket.emit( "request", "hello from client", function( txt?:String )
            {
                log("Client callback received", txt );
            });
 
        });

        this.socket.on( "disconnect", () => 
        {
            console.log( `[socket] connect status: ${this.socket.connected}` );
            this.connect();
        });
 
    }

    public send( key: string, args: any ) 
    {
        log("socket send", key, args );
        this.socket.emit( key, args );
    }

    public request( action:string, args:any )
    {
        this.send( "request", 
        {
            action  : action,
            key     : DATE.getNow()
        })
    }

    public disconnect() 
    {
        this.socket.disconnect(); 
    }
 
};

export default SocketClient;