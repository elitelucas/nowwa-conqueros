import Socket from "./SOCKET/Socket";
import LOG, { log } from "../UTIL/LOG";

import Auth from "./USER/Auth";
import User from "./USER/User";
import File from "./FILE/File";
import WebAuth from "./USER/WebAuth";

 class CONQUER 
{
    public static Initialized   : boolean = false;
    public static Ready         : boolean = false;
    public static User          : User = new User();
    public static Auth          : Auth = new Auth();
    public static WebAuth       : WebAuth = new WebAuth();
    private static Socket       : Socket = new Socket();
    public static File          : File = new File();

    public static async init(): Promise<void> 
    {
        this.Initialized = true;
        log("client: =============== New ConquerOS");

        await this.Socket.init();

        if( typeof window != 'undefined' ) await this.WebAuth.init();

        await this.Auth.init();
        await this.File.init();

        this.Ready = true;
        return Promise.resolve();
    };

    public static async do( action: string, vars?: any ): Promise<any> 
    {
        return this.Socket.do(action, vars);
    }
}

export default CONQUER;

let w;
if (typeof (window) !== 'undefined') {
    w = window;
}
export const _global = (w /* browser */ || global /* node */) as any
_global.CONQUER = CONQUER; 
