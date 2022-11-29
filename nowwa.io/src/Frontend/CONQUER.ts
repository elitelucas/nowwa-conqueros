import SOCKET from "./Socket/SOCKET";
import LOG, { log } from "../UTIL/LOG";
import AUTH from "./User/AUTH";
import USER from "./User/USER";
import FILE from "./File/FILE";
import WEBAUTH from "./User/WEBAUTH";

class CONQUER 
{
    public static Initialized: boolean = false;
    public static Ready: boolean = false;
    public static USER: USER = new USER();
    public static AUTH: AUTH = new AUTH();
    public static WEBAUTH: WEBAUTH = new WEBAUTH();
    private static SOCKET: SOCKET = new SOCKET();
    public static FILE: FILE = new FILE();

    public static async init(): Promise<void> 
    {
        this.Initialized = true;
        log("client: =============== New ConquerOS");

        await this.SOCKET.init();
        await this.AUTH.init();
        await this.FILE.init();

        if (typeof window != 'undefined') {
            await this.WEBAUTH.init();
            if (this.WEBAUTH.SessionStorage.account) {
                // TODO : Exchange webauth account with real conquer account
            }
        }
        this.Ready = true;
        return Promise.resolve();
    };

    public static async do(action: string, vars?: any): Promise<any> 
    {
        return this.SOCKET.do(action, vars);
    }
}
export default CONQUER;

let w;
if (typeof (window) !== 'undefined') {
    w = window;
}
export const _global = (w /* browser */ || global /* node */) as any
_global.CONQUER = CONQUER; 
