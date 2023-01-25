import STRING from "../../../UTIL/STRING";
import DATA from "../../DATA/DATA";
import USERNAME from "../USERNAME";

import LOG, { log } from "../../../UTIL/LOG";
import CRYPT from "../../../UTIL/CRYPT";
import WALLET from "./WALLET";
import AVATAR from "../TRIBE/AVATAR";

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
    let usernameID = await AVATAR.getUsernameIDbyAvatarID(query.avatarID);
    let history: any;

    history = await DATA.get(this.table, { usernameID: usernameID });

    return Promise.resolve(history);
  }

  public static async set(query: any): Promise<any> {
    let item = await DATA.set(this.table, query);

    return Promise.resolve(item);
  }

  public static async addSendHistory(
    usernameID: any,
    amount: number,
    fee: number,
    token: string,
    recipientAddress: string,
    transaction: string
  ): Promise<any> {
    let item = await this.set({
      usernameID,
      type: "send",
      amount,
      fee,
      token,
      recipientAddress,
      transaction,
    });

    return Promise.resolve(item);
  }

  public static async addReceiveHistory(
    usernameID: any,
    amount: number,
    token: string,
    senderAddress: string,
    transaction: string
  ): Promise<any> {
    let item = await this.set({
      usernameID,
      type: "receive",
      amount,
      token,
      senderAddress,
      transaction,
    });

    return Promise.resolve(item);
  }
}

export default WALLET_HISTORY;
