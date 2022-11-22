import DATA from "../DATA/DATA";
import EMAIL from "./EMAIL";
import DATE from '../../UTIL/DATE';
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
        let results     = await DATA.get( USERNAME_PROXY.table, { username:vars.username } ); 

        if( results.length > 1 ) return Promise.reject( LOG.msg( 'Username already exists' ) );  

        let item : any  = await DATA.set( USERNAME_PROXY.table, vars );
 
        EMAIL.set(
        {
            email       : vars.email,
            uID         : vars.uID,
            isVerified  : true,
        });

        return Promise.resolve( item );
    }; 

    /*=============== 


    GET  
    

    ================*/
  
    public static async get( vars:any  ) : Promise<any>
    {
        let results = await DATA.get( USERNAME_PROXY.table, USERNAME_PROXY.getQuery( vars ) ); 

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
        let item = USERNAME_PROXY.get({ where:{ uID:vars.uID } });

        if( !item ) item = await USERNAME_PROXY.set( vars );
 
        return Promise.resolve( item );
    }; 

    /*=============== 


    QUERY  
    

    ================*/

    private static getQuery( vars:any )
    {
        if( vars.where ) return vars;

        var query   : any = { where:{}, values:{} };
        var where   : any = {};

        query.where = where;

        if( vars.uID ) where.uID = vars.uID;

        return query;
    }
 
};

export default USERNAME_PROXY;