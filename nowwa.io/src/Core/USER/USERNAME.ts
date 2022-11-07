import DATA from "../DATA/DATA";
import PROMISE, { resolve, reject } from '../../UTIL/PROMISE';
import EMAIL from "./EMAIL";
import DATE from '../../UTIL/DATE';
import USERNAME_CONTACTS from "./USERNAME_CONTACTS";
import USERNAME_PROXY from "./USERNAME_PROXY";

class USERNAME
{
    private static table : string = "usernames";

    /*=============== 


    SET  
    

    ================*/
  
    public static async set( vars:any ) : Promise<any>
    {
        let results = await DATA.get( USERNAME.table, { username:vars.username } ); 

        if( results.length > 1 ) return reject( "Username already exists" );

        let item : any = await DATA.set( USERNAME.table, vars );

        // Look for previous accounts that have used this email
        // Do merge


        // Add email 
 
        EMAIL.set(
        {
            email       : vars.username,
            isVerified  : vars.isVerified,
            uID         : item._id
        });

        return resolve( item );
    }; 

    /*=============== 


    GET  
    

    ================*/
  
    public static async get( vars:any ) : Promise<any>
    {
        let item = await DATA.getOne( USERNAME.table, USERNAME.getQuery( vars ) ); 
 
        if( !item ) return reject( 'user does not exists...' );
 
        return resolve( item );
    }; 

    private static getQuery( vars:any )
    {
        if( vars.where ) return vars;

        var query   : any = { where:{}, values:{} };
        var where   : any = {};

        query.where = where;

        if( vars.username ) where.username = vars.username;

        return query;
    }

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any )
    {
        var item = await DATA.change( USERNAME.table, query );

        return resolve( item );
    }

    public static async changeLastLogin( uID:any )
    {
        var item = USERNAME.change(
        { 
            where   : { _id : uID },
            values  : { lastLogin : DATE.now() }
        });

        return resolve( item );
    }

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( uID:any ) : Promise<any>
    {
        // remove everything created by this userName


        // remove userName itself

        await DATA.remove( USERNAME.table, uID );

        return resolve();
    }

    /*=============== 


    REPARENT  
    

    ================*/
 
    public static async reparent( newUID:any, oldUID:any ) : Promise<any>
    {
        EMAIL.reparent( newUID, oldUID );
        USERNAME_PROXY.reparent( newUID, oldUID );
        USERNAME_CONTACTS.reparent( newUID, oldUID );

        // Merge game data, wallets, anything else 
 
        USERNAME.remove( oldUID );

        return resolve();
    }
 
};

export default USERNAME;