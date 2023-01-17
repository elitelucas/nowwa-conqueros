import { ACTIONS } from "../../../Models/ENUM";
import CONQUER from "../../CONQUER";
import ShopTabInstance from "./ShopTabInstance";

class Shop
{
    private conquer : CONQUER;
    public tabs     : any;
    private vars    : any = {};
    public data     : any = {};

    constructor( conquer:CONQUER, gameID:any )
    {
        this.conquer    = conquer;
        this.vars       = { gameID:gameID };

        this.get();
    }
 
    public async get( force?:boolean ) : Promise<any>
    {
        if( this.tabs && !force ) return Promise.resolve( this.tabs );
        var tabsData : any = await this.conquer.do( ACTIONS.GAME_SHOPTAB_GET, this.vars );

        this.tabs = {};
        this.data = {};

        for( let tabKey in tabsData ) this.tabs[ tabKey ] = new ShopTabInstance( this.conquer, this, tabsData[ tabKey ] );
        return Promise.resolve( this.tabs );
    }
}

export default Shop;