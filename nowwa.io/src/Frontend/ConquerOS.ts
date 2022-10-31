import SocketClient from "./SocketClient";
import LOG, { log } from "../Core/UTILS/LOG";
import { AnyARecord } from "dns";

class ConquerOS
{
    public socket : any;
    private onInitializedCallback : any;
 
    constructor( callback?:Function ) 
    {
        //if( callback ) 
        this.onInitializedCallback = callback;
        log("New ConquerOS");

        this.socket = new SocketClient( this.onConnect );
 
    }

    private onConnect()
    {
        log("CONNECTED!")

     //   if( this.onInitializedCallback ) this.onInitializedCallback( this );
    }

    

}

export default ConquerOS; 