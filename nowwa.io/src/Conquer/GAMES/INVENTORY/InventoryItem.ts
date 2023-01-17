 
import CONQUER from "../../CONQUER";
import { ACTIONS } from "../../../Models/ENUM";
import PlayerInventory from "./PlayerInventory";

class InventoryItem
{
    private conquer         : CONQUER;
    private gameID          : any;

    public tabKey           : any;
    public name             : any;
    public selected         : boolean;
    public inventoryID      : any;
    public key              : string;

    private inventory    :   PlayerInventory;

    constructor( conquer:CONQUER, inventory:PlayerInventory, data:any )
    {
        this.conquer        = conquer;
        this.gameID         = data.gameID; 
        this.name           = data.name;
        this.inventoryID    = data._id;
        this.selected       = data.selected;
        this.tabKey         = data.tabKey;
        this.key            = data.key;
        this.inventory      = inventory;
    }

    public async set() : Promise<any> // select
    {
        await this.conquer.do( ACTIONS.GAME_PLAYERINVENTORY_CHANGE, { where:{ _id:this.inventoryID }, values:{ selected:true } });

        this.selected = true;

        this.inventory.set( this );

        return Promise.resolve( this );
    }

    public unset()
    {
        if( !this.selected ) return;

        this.conquer.do( ACTIONS.GAME_PLAYERINVENTORY_CHANGE, { where:{ _id:this.inventoryID }, values:{ selected:false } });

        this.selected = false;

        this.inventory.unset( this );
    }

    public remove()
    {
        this.conquer.do( ACTIONS.GAME_PLAYERINVENTORY_REMOVE, { _id:this.inventoryID } );

        this.inventory.remove( this );
    }
}

export default InventoryItem;