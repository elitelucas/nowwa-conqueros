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
        let data : any = await this.conquer.do( ACTIONS.WALLET_GETSET );

        return Promise.resolve( new WalletInstance( this.conquer, data ) );
    };

}

export default Wallets;