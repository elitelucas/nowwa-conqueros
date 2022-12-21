import STRING from '../../../UTIL/STRING';
import DATA from "../../DATA/DATA";
import USERNAME from '../USERNAME';
 
import LOG, { log } from '../../../UTIL/LOG';
import CRYPT from '../../../UTIL/CRYPT';
import WALLET from './WALLET';

class WALLET_HISTORY
{
    private static table : string = "wallet_history";
 
    /*=============== 


    GET  

    {
        usernameID?,
        avatarID?
    }
    

    ================*/
  
    public static async get( query:any ) : Promise<any>
    {
        let value   = await WALLET.getSet( query );
        let wallet  = value.wallet;
 
        let history : any;
 
        /*
            //////// J get the history from the blockchain

            history = the history

        */

        return Promise.resolve( history );
    };
 

};


export default WALLET_HISTORY;