import SocketClient from "./SocketClient";
import LOG, { log } from "../Core/UTILS/LOG";
import { AnyARecord } from "dns";

class ConquerOS
{
    public socket : any;
 
    constructor() 
    {
        log("New ConquerOS");

        this.socket = new SocketClient();

        this.socket.connect();
    }


}

export default ConquerOS; 