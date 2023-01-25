import DATA from "../DATA/DATA";
import LOG, { log } from "../../UTIL/LOG";
import AVATAR from "../USER/TRIBE/AVATAR";
import NFT_HISTORY from "./NFT_HISTORY";
import NFT_TOKEN from "./NFT_TOKEN";
import { from } from "form-data";

class NFT_COLLECTION {
  private static table: string = "nft_collections";
  private static contractAddress: string =
    "0xE74da0A4E7C5FC09fa793498ccE70e598D8432b2";
  private static chainID: number = 5;
  private static tokenBaseURI: string =
    "https://ipfs.io/ipfs/QmarGRwVKPaCe2s5QSSTMEdbYDwKxFz6bAn58YZPPcWc7k/";
  private static tokenExplorerBaseURL: string =
    "https://goerli.etherscan.io/token/0xE74da0A4E7C5FC09fa793498ccE70e598D8432b2?a=";
  private static openseaURL: string =
    "https://testnets.opensea.io/assets/goerli/0xe74da0a4e7c5fc09fa793498cce70e598d8432b2/";
  private static imageBaseURL: string =
    "https://ipfs.io/ipfs/QmXmuSenZRnofhGMz2NyT3Yc4Zrty1TypuiBKDcaBsNw9V/";

  /*=============== 


    GET  

    {
 
    }
    

    ================*/

  public static async get(query?: any): Promise<any> {
    let results: any = await DATA.getOne(this.table, {
      address: this.contractAddress,
    });

    return Promise.resolve(results);
  }

  /*=============== 


    SET  
    
    {
        address: "0xE74da0A4E7C5FC09fa793498ccE70e598D8432b2",
        chainID: 5,
        name: "NOWNFT",
        symbol: "NN",
        maxSupply: 5000, 
        totalSupply: 28,
        mintPrice: 0.07,
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
    let value = await DATA.change(this.table, query);

    return Promise.resolve(value);
  }

  /*=============== 


    REMOVE  
    

    ================*/

  public static async remove(query: any): Promise<any> {
    let removed = await DATA.remove(this.table, query);

    return Promise.resolve(removed);
  }

  /*=============== 


    Mint
    {
        amount, 
        avatarID
    }  
    

    ================*/
  public static async mint(query: any): Promise<any> {
    try {
      let { amount, avatarID } = query;
      avatarID = '63bd738d7d18ac60a60e4dd3'; //temp line

      let collection = await this.get();
      let contract = collection.address;
      let mintPrice = collection.mintPrice;
      let ownerUsernameID = await AVATAR.getUsernameIDbyAvatarID(avatarID);

      /*======================
    
    
        J BLOCHCKAIN CODE
    
        mint - get tokenID and transaction
    
        =========================*/
      let startTokenID = 10; //need code
      let transaction = "xxx"; //need code

      let result = [];
      for (var i = 0; i < amount; i++) {
        let tokenID = startTokenID + i;

        let tokenURI = this.tokenBaseURI + Number(tokenID + 1);      
        let metadata = {}; //get from ipfs
        let attributes = {}; //get from metadata
        let imageURL = this.imageBaseURL + Number(tokenID + 1) + ".gif"; //get from metadata

        let openseaURL = this.openseaURL + tokenID;
        let explorerURL = this.tokenExplorerBaseURL + tokenID;

        let tokenEntry: any = {
          contract: contract,
          tokenID: tokenID,
          ownerUsernameID: ownerUsernameID,
          tokenURI: tokenURI,
          imageURL: imageURL,
          metadata: metadata,
          attributes: attributes,
          explorerURL: explorerURL,
          openseaURL: openseaURL,
          listed: false,
        };

        let tokenData = await NFT_TOKEN.set(tokenEntry);
        result.push(tokenData);

        await NFT_HISTORY.set({
          contract: contract,
          tokenID: tokenID,
          action: "mint",
          price: mintPrice,
          usernameID: ownerUsernameID,
          transaction: transaction,
        });
      }

      return Promise.resolve(result);
    } catch (e) {}
    return Promise.resolve([]);
  }
}

export default NFT_COLLECTION;
