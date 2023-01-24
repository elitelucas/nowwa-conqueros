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
    let result: any = await this.conquer.do(ACTIONS.NFT_COLLECTION_MINT, {
      amount: amount,
    });
    return Promise.resolve(result);
  }

  /*=============== 
 
    GET TOKENS

    ================*/

  public async getTokens(vars?: any): Promise<any> {
    let array: any = await this.conquer.do(ACTIONS.NFT_TOKEN_GET, vars);
    let output: any = [];

    for (let n in array) output.push(new TokenInstance(this.conquer, array[n]));

    return Promise.resolve(output);
  }
}

export default NFTInstance;
