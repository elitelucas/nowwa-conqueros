import { ACTIONS } from "../../../../Models/ENUM";
import CONQUER from "../../../CONQUER";
 
class TokenHistory
{
    private conquer         : CONQUER;
    private tokenID         : any;
 
    public constructor( conquer:CONQUER, tokenID:any ) 
    {
        this.conquer        = conquer;
        this.tokenID        = tokenID;
    }

    public async get() : Promise<any>
    {
        let result = await this.conquer.do( ACTIONS.NFT_HISTORY_GET, { _id:this.tokenID } );
        return Promise.resolve( result );
    }
}

export default TokenHistory;