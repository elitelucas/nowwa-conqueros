import io from 'socket.io-client';
import LOG, { log } from '../Core/UTILS/LOG';

class SocketClient
{
    //#region Socket

    private socketHost = '127.0.0.1';
    // var socketHost = 'nowwa.io';
    private socketPort = 9003;
    // var socketPort = 80;
    private get socketUseSSL() { return false; }
    // var socketUseSSL = true;
    private get socketProtocol(): string { return this.socketUseSSL ? 'https' : 'http'; }
    private get socketPortFinal(): string { return (this.socketPort == 80 && !this.socketUseSSL) || (this.socketPort == 443 && this.socketUseSSL) ? `` : `:${this.socketPort.toString()}`; };
    private get socketURL(): string { return `${this.socketProtocol}://${this.socketHost}${this.socketPortFinal}`; }

    private socket?: any;
    private socketListeners: Map<string, any> = new Map<string, any>();

    constructor()
    {
        log( "New Socket Client");
    }
 
    public connect()
    {
        log("Socket Connect");
        this.socket = io( this.socketURL );
 
        this.socket.on( "connect", () => 
        {
            log("Socket Connected");
            console.log(`[socket] connect status: ${this.socket.connected}`);
        });

        this.socket.on("disconnect", () => 
        {
            console.log(`[socket] connect status: ${this.socket.connected}`);
            this.connect();
        });

        this.socketListeners.forEach((action: any, key: string) => {
            this.socket.on(key, (args: any) => {
                action(args);
            });
        });

        this.socket.connect();
    }

    private SocketSend(key: string, args: any) {
        this.socket.emit(key, args);
    }

    private SocketDisconnect() {
        this.socket.disconnect();
    }

    private SocketAddListener( key: string, action: any) 
    {
        this.socketListeners.set(key, action);
        this.socket.on(key, (args: any) => {
            action(args);
        });
    }
 

};

export default SocketClient;