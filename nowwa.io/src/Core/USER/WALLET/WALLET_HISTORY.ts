import STRING from "../../../UTIL/STRING";
import DATA from "../../DATA/DATA";
import USERNAME from "../USERNAME";

import LOG, { log } from "../../../UTIL/LOG";
import CRYPT from "../../../UTIL/CRYPT";
import WALLET from "./WALLET";

class WALLET_HISTORY {
  private static table: string = "wallet_history";

  /*=============== 


    GET  

    {
        usernameID?,
        avatarID?
    }
    

    ================*/

  public static async get(query: any): Promise<any> {
    let mywallet = await WALLET.getSet(query);
    let address = mywallet.address;

    let history: any;

    history = await DATA.get(this.table, { address: address });

    return Promise.resolve(history);
  }

  public static async set(query: any): Promise<any> {
    let item = await DATA.set(this.table, query);

    return Promise.resolve(item);
  }
}

export default WALLET_HISTORY;