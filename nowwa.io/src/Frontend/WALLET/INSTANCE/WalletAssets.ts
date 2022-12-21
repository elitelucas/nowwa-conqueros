import { ACTIONS } from "../../../Models/ENUM";
import CONQUER from "../../CONQUER";
import WalletInstance from "./WalletInstance";

class WalletAssets
{
    private conquer         : CONQUER;

    public constructor( conquer:CONQUER ) 
    {
        this.conquer        = conquer;
    }

    public async get() : Promise<any>
    {
        let result = await this.conquer.do( ACTIONS.WALLET_HISTORY_GET );
        return Promise.resolve( result );
    }
}

export default WalletAssets;