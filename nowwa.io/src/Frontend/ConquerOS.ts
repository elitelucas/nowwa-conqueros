import SocketClient from "./SocketClient";
import LOG, { log } from "../UTIL/LOG";

class ConquerOS {
    private socketClient: SocketClient;
    private onInitializedCallback: any;

    constructor(callback?: Function) {
        var self = this;

        log("client: =============== New ConquerOS");
        //if( callback ) 
        this.onInitializedCallback = callback;

        let onConnect = this.onConnect.bind(this); // CHECK THIS OUT

        this.socketClient = new SocketClient(onConnect);

    }

    private onConnect() {
        log("client: ========== CONQUER OS CONNECTED!");//,

        this.socketClient.do("test1", null, function (txt: any) {
            log("client: callback test 1", txt);
        })

        this.socketClient.do("test2", null, function (txt: any) {
            log("client: callback test 2", txt);
        })

        this.socketClient.do("test3", null, function (txt: any) {
            log("client: callback test 3", txt);
        })

        this.socketClient.do("test4", null, function (txt: any) {
            log("client: callback test 4", txt);
        })

        /*
        this.socketClient.do("OS test", null, function(txt:any)
        {
            log("OS callback test 1", txt );
        });

        this.socketClient.do("OS test2", null, function(txt:any)
        {
            log("OS callback test 2", txt );
        });

        this.socketClient.do("OS test3", null, function(txt:any)
        {
            log("OS callback test 3", txt );
        });   */

        //   if( this.onInitializedCallback ) this.onInitializedCallback( this );
    }



}

export default ConquerOS; 