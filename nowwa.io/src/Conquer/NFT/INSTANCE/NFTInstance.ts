import { ACTIONS } from "../../../Models/ENUM";
import CONQUER from "../../CONQUER";
import TokenInstance from "./TOKEN/TokenInstance";

class NFTInstance {
  private conquer: CONQUER;
  private data: any;

  public address: string;
  public chainID: number;
  public name: string;
  public symbol: string;
  public totalSupply: number;
  public mintPrice: number;

  public constructor(conquer: CONQUER, data: any) {
    this.conquer = conquer;
    this.data = data;

    this.address = data.address;
    this.chainID = data.chainID;
    this.name = data.name;
    this.symbol = data.symbol;
    this.totalSupply = data.totalSupply;
    this.mintPrice = data.mintPrice;
  }

  /*=============== 
 
   MINT

    ================*/

  public async mint(amount: number): Promise<any> {
    let array: any = await this.conquer.do(ACTIONS.NFT_COLLECTION_MINT, {
      amount: amount,
    });
    let output: any = [];

    for (let n in array) output.push(new TokenInstance(this.conquer, array[n]));

    return Promise.resolve(output);
  }

  /*=============== 
 
    GET TOKENS - get by ownerAvatarID or get all

    ================*/

  public async getTokens(ownerAvatarID?: any): Promise<any> {
    let vars = {};
    if (ownerAvatarID)
      vars = {
        type: "owner",
        contract: this.address,
        ownerAvatarID: ownerAvatarID,
      };
    else vars = { type: "all", contract: this.address };

    let array: any = await this.conquer.do(ACTIONS.NFT_TOKEN_GET, vars);
    let output: any = [];

    for (let n in array) output.push(new TokenInstance(this.conquer, array[n]));

    return Promise.resolve(output);
  }

  public async getToken(tokenID: number): Promise<any> {
    let vars = { type: "tokenID", contract: this.address, tokenID: tokenID };

    let result: any = await this.conquer.do(ACTIONS.NFT_TOKEN_GET, vars);

    return Promise.resolve(new TokenInstance(this.conquer, result));
  }

  public async getListedTokens(): Promise<any> {
    let vars = { type: "listed", contract: this.address };

    let array: any = await this.conquer.do(ACTIONS.NFT_TOKEN_GET, vars);
    let output: any = [];

    for (let n in array) output.push(new TokenInstance(this.conquer, array[n]));

    return Promise.resolve(output);
  }
}

export default NFTInstance;
