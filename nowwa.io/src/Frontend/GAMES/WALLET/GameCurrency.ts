 
import { ACTIONS } from "../../../Models/ENUM";
import CONQUER from "../../CONQUER";

class GameCurrency
{
    private currencyID  : any;
    private conquer     : CONQUER;
    public value        : number;
    private gameID      : any;

    constructor( conquer:CONQUER, data:any )
    {
        this.conquer    = conquer;
        this.currencyID = data._id;
        this.value      = data.value;
        this.gameID     = data.gameID;
    }

    public async increase( amount:number ) : Promise<any>
    {
        let data    = await this.conquer.do( ACTIONS.GAME_CURRENCY_CHANGE, { _id:this.currencyID, increase:amount } );
        this.value  = data.value;
        return Promise.resolve(this);
    }

    public async get() : Promise<any>
    {
        let data    = await this.conquer.do( ACTIONS.GAME_CURRENCY_GETONE, { _id:this.currencyID } );
        this.value  = data.value;

        return Promise.resolve( this.value );
    } 
}

export default GameCurrency;