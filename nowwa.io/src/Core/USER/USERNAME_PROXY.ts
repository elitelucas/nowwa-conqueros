import DATA from "../DATA/DATA";
import EMAIL from "./EMAIL";
import LOG from "../../UTIL/LOG";

class USERNAME_PROXY
{
    private static table : string = "username_proxys";

    /*=============== 


    SET  
    
    { username, email, appid, wallet }

    ================*/
  
    public static async set( vars:any ) : Promise<any>
    {
        let results     = await DATA.get( USERNAME_PROXY.table, { username: vars.username, source: vars.source } ); 

        if( results.length > 1 ) return Promise.reject( LOG.msg( 'Username already exists' ) );  

        let item : any  = await DATA.set( USERNAME_PROXY.table, vars );
 
        await EMAIL.set(
        {
            email       : vars.email,
            usernameID  : vars.usernameID,
            isVerified  : true,
        });

        return Promise.resolve( item );
    }; 

    /*=============== 


    GET  
    

    ================*/
  
    public static async get( vars:any ) : Promise<any>
    {
        let results = await DATA.get( USERNAME_PROXY.table, vars ); 

        let item : any = results[0];
 
        if( !item ) return Promise.reject( LOG.msg( 'User does not exist' ) ); 
 
        return Promise.resolve( item );
    }; 

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any )
    {
        var item = await DATA.change( USERNAME_PROXY.table, query );

        return Promise.resolve( item );
    }

    public static async reparent( newUID:any, oldUID:any ) : Promise<any>
    {
        let results = await DATA.reparent( USERNAME_PROXY.table, newUID, oldUID );

        return Promise.resolve( results );
    }
 
    /*=============== 


    GET SET 
    

    ================*/
  
    public static async getSet( vars:any  ) : Promise<any>
    {
        let item = await DATA.getOne( this.table, { usernameID:vars.usernameID });

        if( !item ) item = await USERNAME_PROXY.set( vars );
 
        return Promise.resolve( item );
    }; 
 
};

export default USERNAME_PROXY;