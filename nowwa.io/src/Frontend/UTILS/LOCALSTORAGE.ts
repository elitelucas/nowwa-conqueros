import DATE from "../../UTIL/DATE";
import RANDOM from "../../UTIL/RANDOM";

class LocalStorage
{

    /*=============== 


    INIT
    

    ================*/

    public static account       : any = {}
    public static searchParams  : any;

    public static async init() : Promise<any>
    {
        this.parseUrlSearchParams();
        this.getAccount();

        return Promise.resolve();
    }

    private static parseUrlSearchParams()
    {
        let params: { [key: string]: any } = 
        {
            username    : "Guest" + DATE.now() + RANDOM.value(1000),
            type        : "GUEST"
        };

        if ( typeof window != 'undefined' ) 
        {
            new URL( window.location.href ).searchParams.forEach( function (val, key) 
            {
                if ( params[key] !== undefined ) 
                {
                    if ( !Array.isArray(params[key]) ) params[key] = [params[key]];
  
                    params[key].push(val);
                } else {
                    params[key] = val;
                }
            });
        
            window.history.pushState( params, "", `${window.location.origin}`);
        }

        LocalStorage.searchParams = params;
    }


    /*=============== 


    GET
    

    ================*/

    public static get = function( key:string ) : any
    {	
   		return typeof window != 'undefined' ? window.localStorage.getItem( key ) : null;
    };

    public static getAccount = function() : any
    {	
        if (typeof window != 'undefined') {
            let json                = window.localStorage.getItem( "account" );
            LocalStorage.account    = json ? JSON.parse( json as string ) : {};
            return LocalStorage.account;
        }
    };
    
    


    /*=============== 


    SET
    

    ================*/

    public static set = function( key:string, value:any ) 
    {
        if ( typeof window != 'undefined') window.localStorage.setItem( key, JSON.stringify( value ));
        return value;
    };

    public static setAccount( vars:any ) 
    {
        this.account = vars;

        this.set( "account", this.account );
        
        return this.account;
    }

    /*=============== 


    REMOVE
    

    ================*/

    public static remove( key:any ) 
    {
        return this.set( key, null );
    }

    public static removeAccount() 
    {
        this.account = {};
        return this.set( "account", this.account );
    }
 
}


namespace LocalStorage 
{
    export type Account = 
    {
        avatarID        : any,
        username        : any,
        token           : string,
        admin           : boolean,
        friend_count    : number,
        type            : 'DISCORD' | 'FACEBOOK' | 'TWITTER' | 'GOOGLE' | 'SNAPCHAT' | 'CONQUER' | 'METAMASK',
        email?          : any,
        wallet?         : string,
        firstName       : string
    }
    export const CreateSearchParams = (account:Account) => 
    {
        let tmp = Object.entries(account);
        let searchParams:URLSearchParams = new URLSearchParams();
        tmp.forEach(element => searchParams.append(element[0], element[1].toString()));
        return searchParams;
    };
}

export default LocalStorage;