import SOCKET from "./Socket/SOCKET";
import LOG, { log } from "../UTIL/LOG";
import AUTH from "./User/AUTH";
import USER from "./User/USER";
import FILE from "./File/FILE";
import WEBAUTH from "./User/WEBAUTH";
import ONESIGNAL from "./Notifications/ONESIGNAL";

class CONQUER 
{
    public static Initialized: boolean = false;
    public static Ready: boolean = false;
    public static USER: USER = new USER();
    public static AUTH: AUTH = new AUTH();
    public static WEBAUTH: WEBAUTH = new WEBAUTH();
    private static SOCKET: SOCKET = new SOCKET();
    public static FILE: FILE = new FILE();
    public static ONESIGNAL:ONESIGNAL = new ONESIGNAL();

    public static async init(): Promise<void> 
    {
        this.Initialized = true;
        log("client: =============== New ConquerOS");

        await this.SOCKET.init();
        await this.AUTH.init();
        await this.WEBAUTH.init();
        await this.ONESIGNAL.init();

        log("Okkkk");

        // this.do("ActionTest").then(function (e?: any) {
        //     log("ACTION PASSED", e);
        // });
        this.Ready = true;
        return Promise.resolve();
    };

    public static async do(action: string, vars?: any): Promise<any> 
    {
        return this.SOCKET.do(action, vars);
    }


    /*

let input005: DB.Query = 
{
"values": {
"key01": 5,
"key02": "save to usernames?"
},
};
 
let item = await DB.set( "usernames", input005);
let id = item._id;
log( 'done 5', JSON.stringify(item), id );

let input006: DB.Query = 
{
"where": {
"_id": id
},
};

let item006 = await DB.get("usernames", input006);
 
log( 'done 6', JSON.stringify(item006) );

let input007: DB.Query = 
{
"where": {
"_id": id
},
"values": {
"key03": "a string"
},
};

let item007 = await DB.change("usernames", input007);

log('done 7', JSON.stringify(item007) );

let input008: DB.Query = 
{
"where": {
"_id": id
},
};

// await DB.remove("schemaLoose", input008);
// log('done 8');

*/
}
export default CONQUER;

let w;
if (typeof (window) !== 'undefined') {
    w = window;
}
export const _global = (w /* browser */ || global /* node */) as any
_global.CONQUER = CONQUER; 
