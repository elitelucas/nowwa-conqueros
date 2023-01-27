import { ACTIONS } from "../../../../Models/ENUM";
import CONQUER from "../../../CONQUER";
import TokenHistory from "./TokenHistory";

class TokenInstance {
  private conquer: CONQUER;
  public History: TokenHistory;
  public contract: string;
  public tokenID: any;
  public ownerUsernameID: any;
  public tokenURI: any;
  public imageURL: any;
  public metadata: any;
  public attributes: any;
  public explorerURL: any;
  public openseaURL: any;
  public listed: boolean;
  public listingPrice: number;

  public constructor(conquer: CONQUER, data: any) {
    this.conquer = conquer;
    this.contract = data.contract;
    this.tokenID = data.tokenID;
    this.ownerUsernameID = data.ownerUsernameID;
    this.tokenURI = data.tokenURI;
    this.metadata = data.metadata;
    this.imageURL = data.imageURL;
    this.attributes = data.attributes;
    this.explorerURL = data.explorerURL;
    this.openseaURL = data.openseaURL;
    this.listed = data.listed;
    this.listingPrice = data.listingPrice;

    this.History = new TokenHistory(conquer, this.contract, this.tokenID);
  }

  public async list(price: number = 0): Promise<any> {
    return this.doAction("list", { price: price });
  }

  public async unlist(vars?: any): Promise<any> {
    return this.doAction("unlist", vars);
  }

  public async buy(vars?: any): Promise<any> {
    return this.doAction("buy", vars);
  }

  private async doAction(action: string, vars?: any) {
    vars = vars || {};
    vars.tokenID = this.tokenID;
    vars.action = action;

    let result = await this.conquer.do(ACTIONS.NFT_TOKEN_CHANGE, vars);

    return Promise.resolve(result);
  }
}

export default TokenInstance;
