import STRING from '../../UTIL/STRING';
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

        if( item ) return Promise.reject( LOG.msg( 'Wallet already exists' ) ); 

        item = await DATA.set( WALLET.table, vars );
 
        return Promise.resolve( item );
    }

    public static async getUID( wallet:string  ) : Promise<any>
    {
        let item = await WALLET.get( { where:{ wallet:wallet }});

        if( item ) return Promise.resolve( item );

        return Promise.reject( LOG.msg( 'Wallet does not exist' ) ); 
    };   
 
    /*=============== 


    GET  
    

    ================*/
  
    public static async get( vars:any ) : Promise<any>
    {
        let results = await DATA.get( WALLET.table, WALLET.getQuery( vars ) ); 

        let item : any = results[0];
 
        if( !item ) return Promise.reject( LOG.msg( 'Wallet does not exist' ) ); 
 
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