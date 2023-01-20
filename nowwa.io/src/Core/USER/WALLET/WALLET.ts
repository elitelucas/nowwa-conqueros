import { ethers } from "ethers";
import STRING from "../../../UTIL/STRING";
import DATA from "../../DATA/DATA";
import USERNAME from "../USERNAME";

import LOG, { log } from "../../../UTIL/LOG";
import CRYPT from "../../../UTIL/CRYPT";
import AVATAR from "../TRIBE/AVATAR";
import WALLET_HISTORY from "./WALLET_HISTORY";

import { plus, minus } from "../../../UTIL/DECIMALS";

import { WITHDRAW_FEES } from "../../CONFIG/WALLET";
import initMempool from "./Backend/receive";
import send_token from "./Backend/send";

class WALLET {
  private static table: string = "wallets";

  public static async init(): Promise<any> {
    initMempool();
  }

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

  public static async send(query: {
    avatarID: string;
    recipientAddress: string;
    amount: number;
  }): Promise<any> {
    console.log("wallet/send", query);
    let { avatarID, recipientAddress, amount } = query;

    let myData = await this.getSet({ avatarID: avatarID });
    if (!myData.success)
      return Promise.resolve({ success: false, message: myData.message });

    let sender_address = myData.data.address;
    let current_balance = myData.data.balance;
    let privateKey = myData.data.privateKey;

    let recipient_wallet = await this.getOne({
      address: recipientAddress,
    });

    let result: any;

    if (recipient_wallet) {
      //internal transfer
      if (current_balance < amount)
        return Promise.resolve({
          success: false,
          message: "Not enough balance",
        });

      let sender_wallet = await this.onSend(
        sender_address,
        amount,
        "ETH",
        recipientAddress,
        "internal"
      );

      await this.onReceive(
        recipientAddress,
        amount,
        "ETH",
        sender_address,
        "internal"
      );
      result = { success: true, data: sender_wallet };
    } else {
      //external withdraw
      let final_amount = plus(amount, WITHDRAW_FEES.ETH);
      if (current_balance < final_amount)
        return Promise.resolve({
          success: false,
          message: "Not enough balance",
        });

      let transaction = await send_token(
        "",
        amount,
        recipientAddress,
        sender_address,
        privateKey
      );
      console.log(transaction);
      if (transaction) {
        let sender_wallet = await this.onSend(
          sender_address,
          amount,
          "ETH",
          recipientAddress,
          transaction
        );
        result = { success: true, data: sender_wallet };
      } else {
        result = { success: false, message: "Error" };
      }
    }

    return Promise.resolve(result);
  }

  public static async onSend(
    address: string,
    amount: number,
    token: string,
    recipientAddress: string,
    transaction: string
  ): Promise<any> {
    let wallet = await this.getOne({
      address: address,
    });
    if (!wallet) return Promise.resolve(null);

    let balance = wallet.balance;
    let usernameID = wallet.usernameID;

    let fee = transaction == "internal" ? 0 : WITHDRAW_FEES.ETH;
    let final_amount =
      transaction == "internal" ? amount : plus(amount, WITHDRAW_FEES.ETH);

    let new_wallet = await DATA.change(this.table, {
      where: { address: address },
      values: {
        balance: minus(balance, final_amount),
      },
    });

    await WALLET_HISTORY.addSendHistory(
      usernameID,
      amount,
      fee,
      token,
      recipientAddress,
      transaction
    );

    return Promise.resolve(new_wallet);
  }

  public static async onReceive(
    address: string,
    amount: number,
    token: string,
    senderAddress: string,
    transaction: string
  ): Promise<any> {
    let wallet = await this.getOne({
      address: address,
    });
    if (!wallet) return Promise.resolve(null);

    let balance = wallet.balance;
    let usernameID = wallet.usernameID;

    let new_wallet = await DATA.change(this.table, {
      where: { address: address },
      values: {
        balance: plus(balance, amount),
      },
    });
    await WALLET_HISTORY.addReceiveHistory(
      usernameID,
      amount,
      token,
      senderAddress,
      transaction
    );

    return Promise.resolve(new_wallet);
  }
}

export default WALLET;
