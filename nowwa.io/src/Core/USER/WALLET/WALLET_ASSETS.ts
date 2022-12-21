import STRING from '../../../UTIL/STRING';
import DATA from "../../DATA/DATA";
import USERNAME from '../USERNAME';
 
import LOG, { log } from '../../../UTIL/LOG';
import CRYPT from '../../../UTIL/CRYPT';
import WALLET from './WALLET';

class WALLET_ASSETS
{
    private static table : string = "wallet_assets";
 
    /*=============== 


    GET  
    
    {
        usernameID?,
        avatarID?
    }

    ================*/
  
    public static async get( query:any ) : Promise<any>
    {
        let value   = await WALLET.get( query );
        let wallet  = value.wallet;

        let assets : any;
 
        /*
            //////// J get the assets from the blockchain

            history = the history

        */

        return Promise.resolve( assets );
    };
 
 
};


export default WALLET_ASSETS;