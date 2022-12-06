import Socket from "./SOCKET/Socket";
import LOG, { log } from "../UTIL/LOG";

import Auth from "./USER/Auth";
import User from "./USER/User";
import File from "./FILE/File";
import WebAuth from "./USER/WebAuth";
import LocalStorage from "./UTILS/LocalStorage";

import Friends from "./FRIENDS/Friends";
class CONQUER 
{
    public static initialized   : boolean = false;
 
    public static LocalStorage  : LocalStorage = new LocalStorage();
    public static Auth          : Auth = new Auth();
    public static User          : User = new User();
    public static WebAuth       : WebAuth = new WebAuth();
    public static File          : File = new File();
    public static Friends       : Friends = new Friends();

    private static Socket       : Socket = new Socket();
 
    public static async init(): Promise<void> 
    {
        await this.WebAuth.init();
        await this.Socket.init();
        await this.Auth.init();
 
        this.initialized = true;

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

