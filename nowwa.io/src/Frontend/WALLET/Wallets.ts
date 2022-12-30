import CONQUER from "../CONQUER";
import WalletInstance from "./INSTANCE/WalletInstance";
import { ACTIONS } from "../../Models/ENUM";

class Wallets
{
    private conquer     : CONQUER;

    public constructor( conquer:CONQUER ) 
    {
        this.conquer    = conquer;
    }
 
    /*=============== 
 
    GET  

    ================*/

    public async get() : Promise<any>
    {
        let res : any = await this.conquer.do( ACTIONS.WALLET_GETSET );

        if(res.success) {
            res.data =  new WalletInstance( this.conquer, res.data );
        }
        return res;
    };

}

export default Wallets;