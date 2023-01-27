import DATA from "../DATA/DATA";
import LOG, { log } from "../../UTIL/LOG";
import NFT_COLLECTION from "./NFT_COLLECTION";
import NFT_HISTORY from "./NFT_HISTORY";
import AVATAR from "../USER/TRIBE/AVATAR";

class NFT_TOKEN {
  private static table: string = "nft_tokens";

  /*=============== 


    GET  

    {
        type - 'all', 'owner', 'tokenID', 'listed',
        contract,
        ownerAvatarID - used for 'owner'
        tokenID - used for 'tokenID'
    }
    

    ================*/

  public static async get(query: any): Promise<any> {
    try {
      console.log("Core/NFT_TOKEN/get", query);
      let { type, contract, ownerAvatarID, tokenID } = query;

      let new_query = {};
      let results;
      if (type == "all") {
        new_query = { contract: contract };
        results = await DATA.get(this.table, new_query);
      }
      if (type == "owner") {
        let ownerUsernameID = await AVATAR.getUsernameIDbyAvatarID(
          ownerAvatarID
        );
        new_query = { contract: contract, ownerUsernameID: ownerUsernameID };
        results = await DATA.get(this.table, new_query);
      }
      if (type == "tokenID") {
        new_query = { contract: contract, tokenID: tokenID };
        results = await DATA.getOne(this.table, new_query);
      }
      if (type == "listed") {
        new_query = { contract: contract, listed: true };
        results = await DATA.get(this.table, new_query);
      }

      return Promise.resolve(results);
    } catch (e) {
      console.log(e);
      return Promise.resolve([]);
    }
  }

  public static async getOne(query: any): Promise<any> {
    let value = await DATA.getOne(this.table, query);

    return Promise.resolve(value);
  }

  /*=============== 


    SET 
    {
        contract - address of collection contract
        tokenID-number of token in collection
        ownerUsernameID - owner’s usernameID
        tokenURI
        imageURL
        metadata - attributes of token
        listed - true/false
        listingPrice
    }

    ================*/

  public static async set(query: any): Promise<any> {
    let value = await DATA.set(this.table, query);

    return Promise.resolve(value);
  }

  /*=============== 


    CHANGE  
    

    ================*/

  public static async change(query: any): Promise<any> {
    let action = query.action;

    if (action == "remove") return this.remove(query);

    let collection = await NFT_COLLECTION.get();
    let contract = collection.contract; //'0x123abcd'
    let transaction;
    let tokenID = query.tokenID;

    let values: any = {};

    delete query.action;

    let tokenData: any = this.get({ _id: tokenID });
    let token = tokenData.token; // address of blockchain token

    /*======================
  
        J BLOCHCKAIN CODE
 
        use contract  
        use action ‘buy’ | ‘list’  | ‘unlist’ | ‘transfer’ 
        get transaction
 
        =========================*/

    let value = await DATA.change(this.table, {
      where: { _id: tokenID },
      values: values,
    });

    // J, needs transaction on the blockchain for history

    NFT_HISTORY.set({
      tokenID: query.tokenID,
      transaction: transaction,
      action: action,
    });

    return Promise.resolve(value);
  }

  /*=============== 


    REMOVE  
    

    ================*/

  public static async remove(query: any): Promise<any> {
    let tokenID = (query._id = query._id || query.tokenID);
    delete query.tokenID;

    let collection = await NFT_COLLECTION.get();
    let contract = collection.contract; //'0x123abcd'
    let transaction;

    /*======================
 

        J BLOCHCKAIN CODE
 
        use contract  
        get transaction
 
        =========================*/

    let value = await DATA.remove(this.table, query);

    // J, needs transaction on the blockchain for history

    NFT_HISTORY.set({
      tokenID: tokenID,
      transaction: transaction,
      action: "remove",
    });

    return Promise.resolve(value);
  }
}

export default NFT_TOKEN;
