import STRING from '../../../UTIL/STRING';
import DATA from "../../DATA/DATA";
import USERNAME from '../USERNAME';
 
import LOG, { log } from '../../../UTIL/LOG';
import CRYPT from '../../../UTIL/CRYPT';

class WALLET_ASSETS
{
    private static table : string = "wallet_assets";
 
 
    /*=============== 


    SET  
    

    ================*/

    public static async set( query: any ) : Promise<any>
    {
        let value = await DATA.set( this.table, query );

        return Promise.resolve( value );
    };
 
 
    /*=============== 


    GET  
    

    ================*/
  
    public static async get( query:any ) : Promise<any>
    {
        let value = await DATA.get( this.table, query );

        return Promise.resolve( value );
    };
 
    /*=============== 


    REMOVE  
    

    ================*/
  
    public static async remove( query:any ) : Promise<any>
    {
        let values = await DATA.remove( this.table, query );

        return Promise.resolve( values );
    };
};


export default WALLET_ASSETS;