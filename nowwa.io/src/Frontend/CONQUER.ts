import SOCKET from "./Socket/SOCKET";
import LOG, { log } from "../UTIL/LOG";
import AUTH from "./User/AUTH";
import USER from "./User/USER";
import FILE from "./File/FILE";

class CONQUER {
    public static Initialized: boolean = false;
    public static Ready: boolean = false;
    public static SearchParams: { [key: string]: any } = {};
    public static USER: USER = new USER();
    public static AUTH: AUTH = new AUTH();
    private static SOCKET: SOCKET = new SOCKET();
    public static FILE: FILE = new FILE();

    public static async init(): Promise<void> {
        this.Initialized = true;
        log("client: =============== New ConquerOS");

        await this.ParseUrlSearchParams();
        // await this.SOCKET.init();
        await this.AUTH.init();

        log("Okkkk");

        // this.do("ActionTest").then(function (e?: any) {
        //     log("ACTION PASSED", e);
        // });
        this.Ready = true;
        return Promise.resolve();
    };

    public static async do(action: string, vars?: any): Promise<any> {
        return this.SOCKET.do(action, vars);
    }

    private static async ParseUrlSearchParams(): Promise<void> {
        let params: { [key: string]: any } = {};
        new URL(window.location.href).searchParams.forEach(function (val, key) {
            if (params[key] !== undefined) {
                if (!Array.isArray(params[key])) {
                    params[key] = [params[key]];
                }
                params[key].push(val);
            } else {
                params[key] = val;
            }
        });
        window.history.pushState(params, "", `${window.location.origin}`);
        this.SearchParams = params;
        return Promise.resolve();
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
