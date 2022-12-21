import { ACTIONS } from "../../../Models/ENUM";
import CONQUER from "../../CONQUER";
import WalletAssets from "./WalletAssets";
import WalletHistory from "./WalletHistory";

class WalletInstance
{
    private conquer     : CONQUER;
 
    public History      : WalletHistory;
    public Assets       : WalletAssets;
    public wallet       : any;

    public constructor( conquer:CONQUER, data:any ) 
    {
        this.conquer    = conquer;
        this.wallet     = data.wallet;
        this.History    = new WalletHistory( conquer );
        this.Assets     = new WalletAssets( conquer );
    }

    public async send( recipientAvatarID:any, contents:any ) : Promise<any>
    {
        let result = await this.conquer.do( ACTIONS.WALLET_SEND, { recipientAvatarID:recipientAvatarID, contents:contents } );
        return Promise.resolve( result );
    }
}

export default WalletInstance;