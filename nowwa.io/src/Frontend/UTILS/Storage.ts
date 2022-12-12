import DATE from "../../UTIL/DATE";
import RANDOM from "../../UTIL/RANDOM";
class Storage
{

    private presetAccount: { username?:string };

    public constructor( username?:string ) {
        this.presetAccount = {
            username: username
        };
    }
    /*=============== 


    INIT
    

    ================*/ 

    public account:any = {};
 
    public async init( ): Promise<any> 
    {
        if (typeof this.presetAccount != 'undefined') {
            console.log(`has preset username: ${this.presetAccount}`);
            this.set("account", {
                username: this.presetAccount
            });
        }
        this.setAccount( this.loadAccount() );
        this.setAccount( this.parseUrlSearchParams() );
        return Promise.resolve();
    }

    private generateUsername()
    {
        return "Guest_" + DATE.now() + RANDOM.value(1000);
    }

    private loadAccount()
    {
        let json = typeof window != 'undefined' ? window.localStorage.getItem( "account" ) : null;
        var vars = json ? JSON.parse( json as string ) : this.presetAccount;

        if( !vars.username ) vars.username = this.generateUsername();

        return vars;
    }
 
    private parseUrlSearchParams()
    {
        let params : any = {};

        if ( typeof window == 'undefined' ) return null;
        
        new URL( window.location.href ).searchParams.forEach( function (val, key) 
        {
            if( params[key] !== undefined ) 
            {
                if ( !Array.isArray(params[key]) ) params[key] = [params[key]];

                params[key].push(val);
            } else {
                params[key] = val;
            }
        });

        console.log(`params`, params);
    
        window.history.pushState( params, "", `${window.location.origin}`);
 
        return params.username ? params : null;
    }


    /*=============== 


    GET
    

    ================*/

    public get( key:string ) : any
    {	
   		return typeof window != 'undefined' ? window.localStorage.getItem( key ) : null;
    }
 
    /*=============== 


    SET
    

    ================*/

    public set( key:string, value:any ) 
    {
        if( typeof window != 'undefined' ) {
            window.localStorage.setItem( key, JSON.stringify( value ));
        }
        return value;
    }

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

        this.remove( "account" );
        let account = {
            username: this.generateUsername()
        };
        return this.setAccount( account );
    }
 
}

namespace Storage 
{
    export type Account = 
    {
        avatarID        : any,
        username        : any,
        token           : any,
        admin           : boolean,
        friend_count    : number,
        type            : 'DISCORD' | 'FACEBOOK' | 'TWITTER' | 'GOOGLE' | 'SNAPCHAT' | 'CONQUER' | 'METAMASK' | 'GUEST' | 'USERNAME',
        email?          : any,
        wallet?         : string,
        firstName       : string
    }
}

export default Storage;