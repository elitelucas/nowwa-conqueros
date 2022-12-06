import Socket from "./SOCKETS/Socket";
import LOG, { log } from "../UTIL/LOG";

import Auth from "./USERS/Auth";
import User from "./USERS/Users";
import File from "./FILES/Files";
import WebAuth from "./USERS/WebAuth";
import { toyBuildUrl } from "../Core/CONFIG/CONFIG";
import LocalStorage from "./UTILS/LocalStorage";

 class CONQUER 
{
    public static initialized   : boolean = false;
    public static Ready         : boolean = false;
    public static LocalStorage  : LocalStorage = new LocalStorage();
    public static Auth          : Auth = new Auth();
    public static User          : User = new User();
    public static WebAuth       : WebAuth = new WebAuth();
    public static File          : File = new File();

    private static Socket       : Socket = new Socket();
 
    public static async init(): Promise<void> 
    {
        this.initialized = true;
        log("client: =============== New ConquerOS");

        await this.Socket.init();

        if( typeof window != 'undefined' ) await this.WebAuth.init();

        await this.Auth.init();
 
        this.Ready = true;
        return Promise.resolve();
    };

    public static async do( action: string, vars?: any ): Promise<any> 
    {
        return this.Socket.do( action, vars );
    }
}

export default CONQUER;

let w;
if (typeof (window) !== 'undefined') {
    w = window;
}
export const _global = (w /* browser */ || global /* node */) as any
_global.CONQUER = CONQUER; 
