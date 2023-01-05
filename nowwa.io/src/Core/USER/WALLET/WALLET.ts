import { ethers } from "ethers";
import STRING from "../../../UTIL/STRING";
import DATA from "../../DATA/DATA";
import USERNAME from "../USERNAME";

import LOG, { log } from "../../../UTIL/LOG";
import CRYPT from "../../../UTIL/CRYPT";
import AVATAR from "../TRIBE/AVATAR";
import WALLET_HISTORY from "./WALLET_HISTORY";

import DECIMALS from "../../../UTIL/DECIMALS";

class WALLET {
  private static table: string = "wallets";

  /*=============== 


    SET  
    

    ================*/

  public static async set(query: any): Promise<any> {
    let item: any = await this.getOne({ where: { address: query.address } });

    if (item) return Promise.resolve(null);

    query.balance = 0;

    item = await DATA.set(WALLET.table, query);

    return Promise.resolve(item);
  }

  public static async getUsernameID(query: any): Promise<any> {
    let item = await DATA.getOne(this.table, query);
    if (item) return Promise.resolve(item.usernameID);

    return Promise.resolve(null);
  }

  /*=============== 


    GET  
    

    ================*/

  public static async get(query: any): Promise<any> {
    let results = await DATA.get(this.table, query);

    return Promise.resolve(results);
  }

  public static async getOne(query: any): Promise<any> {
    let item = await DATA.getOne(this.table, query);

    return Promise.resolve(item);
  }

  /*=============== 

     GETSET
    { avatarID: '63ac6c5a34bba89538a2fde6' }     

    ================*/

  public static async getSet(query: any): Promise<any> {
    console.log("wallet/getSet", query);
    let usernameID = query.usernameID;
    if (!usernameID)
      usernameID = await AVATAR.getUsernameID({ _id: query.avatarID });
    if (!usernameID)
      return Promise.resolve({ success: false, message: "No usernameID" });

    let user = await USERNAME.getOne({ _id: usernameID });
    let username = user.username;

    let item = await this.getOne({ usernameID: usernameID });
    if (!item) {
      const wallet = ethers.Wallet.createRandom();
      item = await this.set({
        usernameID: usernameID,
        username: username,
        address: wallet.address,
        privateKey: wallet.privateKey,
        seed: wallet.mnemonic.phrase,
      });
    }

    return Promise.resolve({ success: true, data: item });
  }

  /*=============== 

    SEND      
    {
      recipientAddress: '0x6f870Ba028DC73ecAE917ABF928F75382b07C39e1',
      amount: 2,
      avatarID: '63ac6c2534bba89538a2fdd4'
    }
    ================*/

  public static async send(query: any): Promise<any> {
    console.log("wallet/send", query);
    let myData = await this.getSet({ avatarID: query.avatarID });
    if (!myData.success)
      return Promise.resolve({ success: false, message: myData.message });

    let usernameID = await AVATAR.getUsernameID({ _id: query.avatarID });

    let recipient_wallet = await this.getOne({
      address: query.recipientAddress,
    });
    if (!recipient_wallet)
      return Promise.resolve({
        success: false,
        message: "Recipient is not valid",
      });

    let amount = query.amount;
    let result: any;

    if (myData.data.balance >= amount) {
      let my_wallet = await DATA.change(this.table, {
        where: { address: myData.data.address },
        values: {
          balance: DECIMALS.minus(myData.data.balance, amount),
        },
      });
      await DATA.change(this.table, {
        where: { address: query.recipientAddress },
        values: {
          balance: DECIMALS.plus(recipient_wallet.balance, amount),
        },
      });

      await WALLET_HISTORY.addSendHistory(
        usernameID,
        amount,
        "ETH",
        query.recipientAddress,
        "internal"
      );
      await WALLET_HISTORY.addReceiveHistory(
        recipient_wallet.usernameID,
        amount,
        "ETH",
        "internal"
      );
      result = { success: true, data: my_wallet };
    } else {
      result = { success: false, message: "Not enough balance" };
    }

    return Promise.resolve(result);
  }
}

export default WALLET;
