import Socket from "./SOCKET/Socket";
import LOG, { log } from "../UTIL/LOG";

import Auth from "./USER/Auth";
import User from "./USER/User";
import File from "./FILE/File"; 
import WebAuth from "./USER/WebAuth";
import Storage from "./UTILS/Storage";

import Friends from "./FRIENDS/Friends";
import Rooms from "./ROOMS/Rooms";
class CONQUER 
{
    public static initialized   : boolean = false;
 
    public static Storage       : Storage;
    public static Auth          : Auth;
    public static User          : User;
    public static WebAuth       : WebAuth;
    public static File          : File;
    public static Friends       : Friends;
    public static Rooms         : Rooms;

    private static Socket       : Socket;
 
    public static async init(): Promise<void> 
    {
        this.Storage    = new Storage();
        this.Friends    = new Friends();
        this.Auth       = new Auth();
        this.WebAuth    = new WebAuth();
        this.File       = new File();
        this.Rooms      = new Rooms();
        this.Socket     = new Socket();
        this.User       = new User();
 
        await this.Storage.init();
        await this.WebAuth.init();
        await this.Socket.init();
        await this.Auth.init();
        this.initialized = true;

        console.log('conquer initialized');

        return Promise.resolve();
    };

    public static async do( action: string, vars?: any ): Promise<any> 
    {
        return this.Socket.do( action, vars );
    }

    public static send( action: string, data: any ) 
    {
        return this.Socket.do( action, data );
    }
}

export default CONQUER;

let w;
if (typeof (window) !== 'undefined') {
    w = window;
}
export const _global = (w /* browser */ || global /* node */) as any
_global.CONQUER = CONQUER; 
