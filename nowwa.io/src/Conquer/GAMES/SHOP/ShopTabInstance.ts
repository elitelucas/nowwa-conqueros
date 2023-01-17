import CONQUER from "../../CONQUER";
import PlayerInventory from "../INVENTORY/PlayerInventory";
import Shop from "./Shop";
import ShopItem from "./ShopItem";

class ShopTabInstance
{
    private conquer : CONQUER;

    public pool : any = [];
    public data : any = {};
    private shop : Shop;

    constructor( conquer:CONQUER, shop:Shop, data:any )
    {
        this.conquer = conquer;
        this.shop = shop;

        for( let n in data.items )
        {
            let shopItem = new ShopItem( conquer, data.items[n] );

            shop.data[ shopItem.key ] = this.data[ shopItem.key ] = shopItem;
            
            this.pool.push( shopItem );
        }

    }
}

export default ShopTabInstance;