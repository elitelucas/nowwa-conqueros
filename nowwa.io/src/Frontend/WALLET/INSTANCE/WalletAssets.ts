import CONQUER from "../../CONQUER";
import WalletInstance from "./WalletInstance";

class WalletAssets
{
    private conquer         : CONQUER;
    private walletInstance  : WalletInstance;
 
    public constructor( conquer:CONQUER, walletInstance:WalletInstance ) 
    {
        this.conquer        = conquer;
        this.walletInstance = walletInstance;
    }
}

export default WalletAssets;