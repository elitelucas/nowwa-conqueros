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

        log( "client: New Socket Client" );

        this.connect();
    }
 
    private connect()  
    {
        log( "client: Socket Connect" );
        
        this.socket = io( this.socketURL );
 
        this.socket.on( "connect", () => 
        {
            this.id = this.socket.id;

            log( "Socket Connected", this.id );
            console.log(`[socket] connect status: ${this.socket.connected}`);
 
            log( "client: ============ Socket connected" );
            
            /*
            this.do("test", null, function(txt:any)
            {
                log("client: callback test 1", txt );
            });

            this.do("test2", null, function(txt:any)
            {
                log("client: callback test 2", txt );
            });

            this.do("test3", null, function(txt:any)
            {
                log("client: callback test 3", txt );
            });    */

            if( !this.isFirstTime ) return;
            this.isFirstTime = false;

            this.onInitializedCallback();

            ///=============================== 
            
            /*
            this.do( "test3", null, function( txt:any )
            {
                log("client: callback test 3", txt );
            }); */

        });

        this.socket.on( "disconnect", () => 
        {
            console.log( `client: connect status: ${this.socket.connected}` );
            this.connect();
        });
 
    }
 
    public do( action:string, vars?:any, callback?:Function )
    {
        log("client: Calling action", action );
        this.socket.emit( "action", action, vars, callback );
    }

    public disconnect() 
    {
        this.socket.disconnect(); 
    }
 
};

export default SocketClient;