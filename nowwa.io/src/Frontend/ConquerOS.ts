import SocketClient from "./SocketClient";
import LOG, { log } from "../UTIL/LOG";

class ConquerOS
{
    private sClient : SocketClient;
    private onInitializedCallback : any;
 
    constructor( callback?:Function ) 
    {
        //if( callback ) 
        this.onInitializedCallback = callback;
        log("New ConquerOS");

        this.sClient = new SocketClient( this.onConnect );
 
    }

    private onConnect()
    {
        log("CONNECTED!" );

        return;



     //   if( this.onInitializedCallback ) this.onInitializedCallback( this );
    }

    

}

export default ConquerOS; 