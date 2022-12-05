import STRING from '../../UTIL/STRING';
import DATA from "../DATA/DATA";
import USERNAME from './USERNAME';
 
import LOG, { log } from '../../UTIL/LOG';
import CRYPT from '../../UTIL/CRYPT';

class APPID
{
    private static table : string = "username_appids";
 
 
    /*=============== 


    SET  
    

    ================*/

    public static async set( vars:any ) : Promise<any>
    {
        let item : any = await APPID.get({ where:{ appid:vars.appid }} );

        if( item ) return Promise.reject( LOG.msg( 'App ID already exists' ) ); 

        item = await DATA.set( APPID.table, vars );
 
        return Promise.resolve( item );
    }

    public static async getUID( appid:string  ) : Promise<any>
    {
        let item = await APPID.get( { where:{ appid:appid }});

        if( item ) return Promise.resolve( item );

        return Promise.reject( LOG.msg( 'App ID does not exist' ) ); 
    };   
 
    /*=============== 


    GET  
    

    ================*/
  
    public static async get( vars:any ) : Promise<any>
    {
        let results = await DATA.get( APPID.table, APPID.getQuery( vars ) ); 

        let item : any = results[0];
 
        if( !item ) return Promise.reject( LOG.msg( 'App ID does not exist' ) ); 
 
        return Promise.resolve( item );
    };     

    /*=============== 


    QUERY  
    

    ================*/

    private static getQuery( vars:any )
    {
        if( vars.where ) return vars;

        var query : any = { where:{} };
        var where : any = {};
        
        query.where = where;

        if( vars.appid )
        {
            where.appid = vars.appid;
            return query;
        }

        if( vars.usernameID )      where.usernameID = vars.usernameID;
        if( vars._id )      where._id = vars._id;

        return query;
    }

};


export default APPID;