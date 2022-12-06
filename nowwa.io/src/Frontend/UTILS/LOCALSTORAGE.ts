import DATE from "../../UTIL/DATE";
import RANDOM from "../../UTIL/RANDOM";
import CONQUER from "../CONQUER";
class LocalStorage
{

    /*=============== 


    INIT
    

    ================*/

    public account       : any = {}
 
    constructor()
    {   
        CONQUER.LocalStorage.setAccount( this.loadAccount() );
        this.setAccount( this.parseUrlSearchParams() );
    };

    private loadAccount()
    {
        let json = typeof window != 'undefined' ? window.localStorage.getItem( "account" ) : null;
        var vars = json ? JSON.parse( json as string ) : {};

        if( !vars.username ) vars.username = "Guest_" + DATE.now() + RANDOM.value(1000);

        return vars;
    };
 
    private parseUrlSearchParams()
    {
        let params : any = {};

        if ( typeof window == 'undefined' ) return null;
        
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
 
        return params.username ? params : null;
    };


    /*=============== 


    GET
    

    ================*/

    public get = function( key:string ) : any
    {	
   		return typeof window != 'undefined' ? window.localStorage.getItem( key ) : null;
    };
 
    /*=============== 


    SET
    

    ================*/

    public set = function( key:string, value:any ) 
    {
        if ( typeof window != 'undefined') window.localStorage.setItem( key, JSON.stringify( value ));
        return value;
    };

    public setAccount( vars?:any ) 
    {
        if( !vars ) return;

        this.account = vars;

        this.set( "account", this.account );
        
        return this.account;
    }

    /*=============== 


    REMOVE
    

    ================*/

    public remove( key:any ) 
    {
        return this.set( key, null );
    }

    public removeAccount() 
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
        token           : any,
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