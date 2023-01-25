import { ACTIONS } from "../../../../Models/ENUM";
import CONQUER from "../../../CONQUER";

class TokenHistory {
  private conquer: CONQUER;
  private contract: string;
  private tokenID: number;

  public constructor(conquer: CONQUER, contract: string, tokenID: number) {
    this.conquer = conquer;
    this.contract = contract;
    this.tokenID = tokenID;
  }

  public async get(): Promise<any> {
    let result = await this.conquer.do(ACTIONS.NFT_HISTORY_GET, {
      contract: this.contract,
      tokenID: this.tokenID,
    });
    return Promise.resolve(result);
  }
}

export default TokenHistory;
