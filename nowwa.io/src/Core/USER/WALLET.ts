import STRING from '../../UTIL/STRING';
import PROMISE, { resolve, reject } from '../../UTIL/PROMISE';
import DATA from "../DATA/DATA";
import USERNAME from './USERNAME';
 
import LOG, { log } from '../../UTIL/LOG';
import CRYPT from '../../UTIL/CRYPT';

class WALLET
{
    private static table : string = "username_wallets";
 
 
    /*=============== 


    SET  
    

    ================*/

    public static async set( vars:any ) : Promise<any>
    {
        let item : any = await WALLET.get({ where:{ wallet:vars.wallet }} );

        if( item ) return reject( "Wallet already exists" );

        item = await DATA.set( WALLET.table, vars );
 
        return resolve( item );
    }

    public static async getUID( wallet:string  ) : Promise<any>
    {
        let item = await WALLET.get( { where:{ wallet:wallet }});

        if( item ) return resolve( item );

        return reject( 'Wallet username does not exists...' )
    };   
 
    /*=============== 


    GET  
    

    ================*/
  
    public static async get( vars:any ) : Promise<any>
    {
        let results = await DATA.get( WALLET.table, WALLET.getQuery( vars ) ); 

        let item : any = results[0];
 
        if( !item ) return reject( new Error( 'Wallet does not exist' ) );
 
        return resolve( item );
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

        if( vars.wallet )
        {
            where.wallet = vars.wallet;
            return query;
        }

        if( vars.uID )      where.uID = vars.uID;
        if( vars._id )      where._id = vars._id;

        return query;
    }

};


export default WALLET;