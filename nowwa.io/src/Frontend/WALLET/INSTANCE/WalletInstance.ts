import CONQUER from "../../CONQUER";
import WalletAssets from "./WalletAssets";
import WalletCurrencies from "./WalletCurrencies";
import WalletHistory from "./WalletHistory";

class WalletInstance
{
    private conquer     : CONQUER;

    public Currencies   : WalletCurrencies;
    public walletID     : any;
    public wallet       : any;
    public History      : WalletHistory;
    public Assets       : WalletAssets;

    public constructor( conquer:CONQUER, data:any ) 
    {
        this.conquer    = conquer;
        this.walletID   = data._id;
        this.wallet     = data.wallet;

        this.Currencies = new WalletCurrencies( conquer, this );
        this.History    = new WalletHistory( conquer, this );
        this.Assets     = new WalletAssets( conquer, this );
    }
}

export default WalletInstance;