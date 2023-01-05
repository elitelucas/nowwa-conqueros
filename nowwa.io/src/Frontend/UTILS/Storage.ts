import e from "express";
import DATE from "../../UTIL/DATE";
import RANDOM from "../../UTIL/RANDOM";
import CONQUER from "../CONQUER";
import User from "../USER/User";

class Storage
{

    private conquer: CONQUER;

    public constructor( instance:CONQUER) {
        this.conquer = instance;
    }
    /*=============== 


    INIT
    

    ================*/ 
 
    public async init( ): Promise<any> 
    {
        // console.log('storage initializing...');

        this.setAccount( this.conquer.User );
        this.setAccount( this.loadAccount() );
        this.setAccount( this.parseUrlSearchParams() );

        // console.log('storage initialized!');

        return Promise.resolve();
    }

    private generateUsername()
    {
        return "Guest_" + DATE.now() + RANDOM.value(1000);
    }

    private loadAccount()
    {
        let json = typeof window != 'undefined' ? window.localStorage.getItem( "account" ) : null;
        // console.log(`[Storage] loadAccount json`, JSON.stringify(json));
        if (json == 'null' || json == '{}') json = null;
        var user:User = json ? 
            JSON.parse( json as string ) : 
            {
                username: this.generateUsername()
            };
        // console.log(`[Storage] loadAccount user`, JSON.stringify(user));
        return user;
    }
 
    private parseUrlSearchParams()
    {

        let originalParams:{[key:string]:any} = { };
        let params : any = {};

        if ( typeof window == 'undefined' ) return null;
        
        new URL( window.location.href ).searchParams.forEach((val, key) => 
        {
            if (User.Fields.indexOf(key) >= 0) {
                
                if( params[key] !== undefined ) 
                {
                    if ( !Array.isArray(params[key]) ) params[key] = [params[key]];

                    params[key].push(val);
                } else {
                    params[key] = val;
                }
            } else {
                originalParams[key] = val;
            }
        });

        // console.log(`window.location.href`, window.location.href);

        // console.log(`params`, params);
        
        let originalSearchParams:string = Object.keys(originalParams).map(key => key + '=' + originalParams[key]).join('&');
        let originalUrl = window.location.href.substring(0, window.location.href.indexOf('?')) + `${originalSearchParams.length > 0 ? "?" + originalSearchParams : ""}`;
    
        window.history.pushState( params, "", `${originalUrl}`);
 
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
            if (value == null) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem( key, JSON.stringify( value ));
            }
        }
        value;
    }

    public setAccount( user?:User ) 
    {
        // console.log(`[Storage] setAccount typeof user`, typeof user);
        if( !user ) return;
        // console.log(`[Storage] user`, JSON.stringify(user));

        this.conquer.User = user;

        this.set( "account", user);
    }

    /*=============== 


    REMOVE
    

    ================*/

    public remove( key:any ) 
    {
        this.set( key, null );
    }

    public removeAccount() 
    {
        this.remove( "account" );
        this.setAccount( this.loadAccount() );
    }
 
}

namespace Storage 
{

}

export default Storage;