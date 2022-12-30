import { ACTIONS } from "../../../Models/ENUM";
import CONQUER from "../../CONQUER";
import WalletAssets from "./WalletAssets";
import WalletHistory from "./WalletHistory";

class WalletInstance
{
    private conquer     : CONQUER;
 
    public History      : WalletHistory;
    public Assets       : WalletAssets;
    public address       : any;
    public balance       : any;

    public constructor( conquer:CONQUER, data:any ) 
    {
        this.conquer    = conquer;
        this.address     = data.address;
        this.balance     = data.balance;
        this.History    = new WalletHistory( conquer );
        this.Assets     = new WalletAssets( conquer );
    }

    public async send( recipientAddress:any, amount:any ) : Promise<any>
    {
        let result = await this.conquer.do( ACTIONS.WALLET_SEND, { recipientAddress:recipientAddress, amount:amount } );
        return Promise.resolve( result );
    }
}

export default WalletInstance;