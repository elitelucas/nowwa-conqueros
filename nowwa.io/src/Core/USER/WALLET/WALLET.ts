import STRING from '../../../UTIL/STRING';
import DATA from "../../DATA/DATA";
import USERNAME from '../USERNAME';
 
import LOG, { log } from '../../../UTIL/LOG';
import CRYPT from '../../../UTIL/CRYPT';
import AVATAR from '../TRIBE/AVATAR';

class WALLET
{
    private static table : string = "wallets";
 
 
    /*=============== 


    SET  
    

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let item : any = await this.getOne({ where:{ wallet:query.wallet }} );

        if( item ) return Promise.resolve( null );; 

        item = await DATA.set( WALLET.table, query );
 
        return Promise.resolve( item );
    }

    public static async getUsernameID( query:any ) : Promise<any>
    {
        let item = await DATA.getOne( this.table, query );
        if( item ) return Promise.resolve( item.usernameID );

        return Promise.resolve(null);
    };   
 
    /*=============== 


    GET  
    

    ================*/
  
    public static async get( query:any ) : Promise<any>
    {
        let results = await DATA.get( this.table, query ); 
 
        return Promise.resolve( results );
    };     

    public static async getOne( query:any ) : Promise<any>
    {
        let item = await DATA.getOne( this.table, query ); 
 
        return Promise.resolve( item );
    };  

    public static async getSet( query:any ) : Promise<any>
    {
        let usernameID = query.usernameID;
        if( !usernameID ) usernameID = await AVATAR.getUsernameID( { avatarID:query.avatarID } );
 
        let item = this.getOne({ usernameID:usernameID });

        if( !item )
        {
            let wallet : any;

            /*
                //////// J Create wallet

                wallet = the address 

            */

            item = await this.set({ usernameID:usernameID, wallet:wallet } );
        }
 
        return Promise.resolve( item );
    };

    /*=============== 


    SEND  
    

    ================*/

    public static async send( query:any ) : Promise<any>
    {
        let myData          = await this.getSet({ avatarID:query.avatarID });
        let myWallet        = myData.wallet;

        let recipientData   = await this.getSet({ avatarID:query.recipientAvatarID });
        let recipientWallet = recipientData.wallet;

        let contents        = query.contents;
        let result : any;

        /*
            //////// J transer contents from myWallet to recipientWallet

            myWallet --> contents -> recipientWallet

            result = true / false? 

        */
 
        return Promise.resolve( result );
    };  
 
};


export default WALLET;