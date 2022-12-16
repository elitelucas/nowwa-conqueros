import { ACTIONS } from "../../../Models/ENUM";
import CONQUER from "../../CONQUER";
import GameCurrency from "./GameCurrency";

class GameWallet
{
    private conquer     : CONQUER;
    private vars        : any;
    public currencies   : any = {};

    constructor( conquer:CONQUER, gameID:any )
    {
        this.conquer    = conquer;
        this.vars       = { gameID:gameID };

        this.get();
    }

    public async get( currencyName?:any ) : Promise<any>
    {
        if( currencyName )
        {
            let currencyInstance = await this.getCurrency( currencyName );
            return Promise.resolve( currencyInstance );
        }

        let entries : any = this.conquer.do( ACTIONS.GAME_CURRENCY_GET, this.vars );

        for( let n in entries ) this.setCurrency( entries[n] );

        return Promise.resolve( this.currencies );
    };

    private setCurrency( currencyData:any )
    {
        this.currencies[ currencyData.name ] = new GameCurrency( this.conquer, currencyData );

        return this.currencies[ currencyData.name ];
    };

    public async increase( currencyName:any, amount:number ) : Promise<any>
    {
        let currencyInstance = await this.getCurrency( currencyName );

        await currencyInstance.increase( amount );

        return Promise.resolve( currencyInstance );
    };

    public async getCurrency( currencyName:any ) : Promise<any>
    {
        let currencyInstance : GameCurrency = this.currencies[ currencyName ];
        if( currencyInstance ) return Promise.resolve( currencyInstance );

        let currencyData = await this.conquer.do( ACTIONS.GAME_CURRENCY_GETONE, { gameID:this.vars.gameID, name:currencyName } );
 
        return Promise.resolve( this.setCurrency( currencyData ));
    }
 
}

export default GameWallet;