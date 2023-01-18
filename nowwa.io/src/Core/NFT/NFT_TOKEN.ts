import DATA from "../DATA/DATA";
import LOG, { log } from "../../UTIL/LOG";
import NFT_COLLECTION from "./NFT_COLLECTION";
import NFT_HISTORY from "./NFT_HISTORY";
import AVATAR from "../USER/TRIBE/AVATAR";

class NFT_TOKEN
{
    private static table : string = "nft_tokens";

    /*=============== 


    GET  

    {
        gameID,
        avatarID
    }
    

    ================*/

    public static async get( query : any ) : Promise<any>
    {
        let results : any   = await DATA.get( this.table, query );
 
        return Promise.resolve( results );
    };

    public static async getOne( query: any ) : Promise<any>
    {
        let value = await DATA.getOne( this.table, query );

        return Promise.resolve( value );
    };

 
    /*=============== 


    SET  (MINT)
    {
        usernameID - owner’s usernameID
        imageURL
        metadata - attributes of token
        listed - true/false
        price
    }

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let collection  = await NFT_COLLECTION.getOne();
        let contract    = collection.contract; //'0x123abcd' 
        let amount      = query.amount || 1;
        let usernameID  = AVATAR.getUsernameID({ avatarID:query.avatarID });

        let token;
        let openseaLink;	 
        let etherscanLink;
        let metadata;
        let imageURL;
        let transaction;

        /*======================
 

        J BLOCHCKAIN CODE
 
        use contract '0x123abcd' 
        get 'token' address from blockchain mint() protocol 
        get transaction

        =========================*/

        let tokenEntry : any = 
        {
            token           : token, // address of the blockchain token
            contract        : contract,
            openseaLink     : openseaLink,
            etherscanLink   : etherscanLink,
            usernameID      : usernameID,
            metadata        : metadata,
            imageURL        : imageURL,
            listed          : false
        };
 
        let value = await DATA.set( this.table, tokenEntry );

        // J, needs transaction on the blockchain for history
 
        NFT_HISTORY.set({ tokenID : value._id, transaction:transaction, action:"mint" });
 
        return Promise.resolve( value );
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any ) : Promise<any>
    {
        let action          = query.action;

        if( action == "remove" ) return this.remove( query );

        let collection      = await NFT_COLLECTION.getOne();
        let contract        = collection.contract; //'0x123abcd' 
        let transaction;
        let tokenID         = query.tokenID;

        let values : any    = { };

        delete query.action;

        let tokenData  : any = this.get( { _id:tokenID } );
        let token = tokenData.token; // address of blockchain token

  
        /*======================
  
        J BLOCHCKAIN CODE
 
        use contract  
        use action ‘buy’ | ‘list’  | ‘unlist’ | ‘transfer’ 
        get transaction
 
        =========================*/
 
        let value = await DATA.change( this.table, { where:{ _id:tokenID }, values:values } );

        // J, needs transaction on the blockchain for history
 
        NFT_HISTORY.set({ tokenID : query.tokenID, transaction:transaction, action:action });
 
        return Promise.resolve( value );
    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query:any ) : Promise<any>
    {
        let tokenID = query._id = query._id || query.tokenID
        delete query.tokenID;

        let collection  = await NFT_COLLECTION.getOne();
        let contract    = collection.contract; //'0x123abcd' 
        let transaction;
   
        /*======================
 

        J BLOCHCKAIN CODE
 
        use contract  
        get transaction
 
        =========================*/
 
        let value = await DATA.remove( this.table, query );

        // J, needs transaction on the blockchain for history
 
        NFT_HISTORY.set({ tokenID:tokenID, transaction:transaction, action:"remove" });
 
        return Promise.resolve( value );
    };
 
};

export default NFT_TOKEN;