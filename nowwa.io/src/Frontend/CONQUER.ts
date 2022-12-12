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
    public initialized   : boolean = false;
    public initializing   : boolean = false;
 
    public Storage       : Storage;
    public Auth          : Auth;
    public User          : User;
    public WebAuth       : WebAuth;
    public File          : File;
    public Friends       : Friends;
    public Rooms         : Rooms;

    private Socket       : Socket;
 
    public constructor( username?:string )
    {
        this.Storage    = new Storage(username);
        this.Friends    = new Friends(this);
        this.Auth       = new Auth(this);
        this.WebAuth    = new WebAuth();
        this.File       = new File(this);
        this.Rooms      = new Rooms(this);
        this.Socket     = new Socket(this);
        this.User       = new User(this);
    };

    public async init (): Promise<void> {
        this.initializing = true;
 
        await this.Storage.init();
        await this.WebAuth.init();
        await this.Socket.init();
        await this.Auth.init();

        this.initialized = true;

        console.log('conquer initialized');

        return Promise.resolve();
    }

    public async do( action:any, data?:any ): Promise<any> 
    {
        return this.Socket.do( action, data );
    }

    public send( action:any, roomID:any, data:any ) 
    {
        return this.Socket.send( action, roomID, data );
    }
}

export default CONQUER;

let w;
if (typeof (window) !== 'undefined') {
    w = window;
}
export const _global = (w /* browser */ || global /* node */) as any
_global.CONQUER = CONQUER; 
