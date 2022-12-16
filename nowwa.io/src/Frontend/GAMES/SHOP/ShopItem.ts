import CONQUER from "../../CONQUER";

class ShopItem
{
    private conquer : CONQUER;
    public key      : string;
    public price    : number;
    public tabKey   : string;
    public currency : string;
    public name     : string;
    public ad       : string;
    public amount   : number;
    public metadata : any;
    public id       : any;
 
    constructor( conquer:CONQUER, data:any )
    {
        this.conquer    = conquer;

        this.key        = data.key;
        this.price      = data.price;
        this.tabKey     = data.tabKey;
        this.currency   = data.currency;
        this.name       = data.name;
        this.ad         = data.ad;
        this.amount     = data.amount;
        this.metadata   = data.metadata;
        this.id         = data._id;
    }


}

export default ShopItem;