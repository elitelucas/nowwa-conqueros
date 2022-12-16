import CONQUER from "../../CONQUER";
import ShopItem from "./ShopItem";

class ShopTabInstance
{
    private conquer : CONQUER;

    public pool : any = [];
    public data : any = {};

    constructor( conquer:CONQUER, data:any )
    {
        this.conquer = conquer;

        for( let n in data.items )
        {
            let shopItem = new ShopItem( conquer, data.items[n] );

            this.data[ shopItem.key ] = shopItem;
            
            this.pool.push( shopItem );
        }

    }
}

export default ShopTabInstance;