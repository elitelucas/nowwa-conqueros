import DATA from "../DATA/DATA";
import EMAIL from "./EMAIL";
import LOG from "../../UTIL/LOG";
import USERNAME from "./USERNAME";

class USERNAME_PROXY
{
    private static table : string = "username_proxys";

    /*=============== 


    SET  
    
    { username, email, appid, wallet }

    ================*/
  
    public static async set( vars:any ) : Promise<any>
    {
        let results     = await DATA.get( this.table, { username: vars.username, source: vars.source } ); 

        if( results.length > 1 ) return Promise.reject( LOG.msg( 'Username already exists' ) );  

        let item : any  = await DATA.set( this.table, vars );
 
        if (vars.email) {
            await EMAIL.set(
            {
                email       : vars.email,
                usernameID  : vars.usernameID,
                isVerified  : true,
            });
        }

        return Promise.resolve( item );
    }; 

    /*=============== 


    GET  
    

    ================*/
  
    public static async get( vars:any ) : Promise<any>
    {
        let results = await DATA.get( this.table, vars ); 

        let item : any = results[0];
 
        if( !item ) return Promise.reject( LOG.msg( 'User does not exist' ) ); 
 
        return Promise.resolve( item );
    }; 

    public static async getUsernameID( vars:any  ) : Promise<any>
    {
        let item = await DATA.getOne( this.table, vars ); 

        if( item ) return Promise.resolve( item.usernameID );

        return Promise.resolve(null);
    };  

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any )
    {
        var item = await DATA.change( this.table, query );

        return Promise.resolve( item );
    }

    public static async reparent( newUID:any, oldUID:any ) : Promise<any>
    {
        let results = await DATA.reparent( this.table, newUID, oldUID );

        return Promise.resolve( results );
    }
 
    /*=============== 


    GET SET 
    

    ================*/
  
    public static async getSet( vars:any  ) : Promise<any>
    {
        let item = await DATA.getOne( this.table, { usernameID:vars.usernameID });

        if( !item ) item = await this.set( vars );
 
        return Promise.resolve( item );
    }; 
 
};

export default USERNAME_PROXY;