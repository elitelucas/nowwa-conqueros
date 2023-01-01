import Socket from "./SOCKET/Socket";
import LOG, { log } from "../UTIL/LOG";

import Auth from "./USER/Auth";
import User from "./USER/User";
import Files from "./FILE/Files"; 
import WebAuth from "./USER/WebAuth";
import Storage from "./UTILS/Storage";

import Friends from "./FRIENDS/Friends";
import Rooms from "./ROOMS/Rooms";
import Analytics from "./ANALYTICS/Analytics";
import Followers from "./FOLLOWERS/Followers";
import Games from "./GAMES/Games";
import Tags from "./ITEM/Tags";
import Instances from "./ITEM/Instances";
import Wallets from "./WALLET/Wallets";
import Sounds from "./AUDIO/Sounds";

class CONQUER 
{
    public initialized  : boolean = false;
 
    public Storage      : Storage;
    public Auth         : Auth;
    public User?         : User;
    public WebAuth      : WebAuth;
    public Files        : Files;
    public Friends      : Friends;
    public Rooms        : Rooms;
    public Analytics    : Analytics;
    public Followers    : Followers;
    public Games        : Games;
    public Wallets      : Wallets;
    public Sounds       : Sounds;

    public Instances    : Instances;
 
    private Socket      : Socket;
 
    public constructor( user?:User )
    {
        this.User       = user;
        this.Storage    = new Storage( this );
        this.Friends    = new Friends( this );
        this.Auth       = new Auth( this );
        this.WebAuth    = new WebAuth();
        this.Files      = new Files( this );
        this.Rooms      = new Rooms( this );
        this.Socket     = new Socket( this );
        this.Analytics  = new Analytics(this);
        this.Followers  = new Followers( this );
        this.Games      = new Games( this );
        this.Instances  = new Instances( this );
        this.Wallets    = new Wallets( this );
        this.Sounds     = new Sounds();
    };

    public async init (): Promise<void> 
    {

        console.log('conquer initializing...');

        await this.Storage.init();
        await this.WebAuth.init();
        await this.Socket.init();
        await this.Auth.init();
        
        this.initialized = true;

        console.log('conquer initialized!');

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
