import STRING from '../../../UTIL/STRING';
import DATA from "../../DATA/DATA";
import USERNAME from '../USERNAME';
 
import LOG, { log } from '../../../UTIL/LOG';
import CRYPT from '../../../UTIL/CRYPT';

class WALLET
{
    private static table : string = "wallets";
 
 
    /*=============== 


    SET  
    

    ================*/

    public static async set( vars:any ) : Promise<any>
    {
        let item : any = await this.getOne({ where:{ wallet:vars.wallet }} );

        if( item ) return Promise.resolve( null );; 

        item = await DATA.set( WALLET.table, vars );
 
        return Promise.resolve( item );
    }

    public static async getUsernameID( vars:any ) : Promise<any>
    {
        let item = await DATA.getOne( this.table, vars );
        if( item ) return Promise.resolve( item.usernameID );

        return Promise.resolve(null);
    };   
 
    /*=============== 


    GET  
    

    ================*/
  
    public static async get( vars:any ) : Promise<any>
    {
        let results = await DATA.get( this.table, vars ); 
 
        return Promise.resolve( results );
    };     

    public static async getOne( vars:any ) : Promise<any>
    {
        let item = await DATA.getOne( this.table, vars ); 
 
        return Promise.resolve( item );
    };  
    

};


export default WALLET;