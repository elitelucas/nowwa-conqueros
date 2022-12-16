 
import CONQUER from "../../CONQUER";
import { ACTIONS } from "../../../Models/ENUM";
import InventoryItem from "./InventoryItem";
import ARRAY from "../../../UTIL/ARRAY";

class PlayerInventory
{
    private conquer : CONQUER;
    private gameID  : any;

    public pool : any;
    public tabs : any;
    public selected : any;

    constructor( conquer:CONQUER, gameID:any )
    {
        this.conquer = conquer;
        this.gameID = gameID; 

        this.get();
    }

    public async get( force?:boolean ) : Promise<any>
    {
        if( this.pool && !force ) return Promise.resolve( this.pool );

        let data = await this.conquer.do( ACTIONS.GAME_PLAYERINVENTORY_GET, { gameID:this.gameID } )

        this.pool = [];
        this.tabs = {};
        this.selected = {};

        for( let n in data )
        {
            let item = new InventoryItem( this.conquer, this, data[n] );

            this.pool.push( item );

            if( !this.tabs[ item.tabKey ] ) this.tabs[ item.tabKey ] = [];
            this.tabs[ item.tabKey ].push( item );

            if( item.selected ) this.selected[ item.tabKey ] = item;
        }

        return Promise.resolve( this.pool );
    }

    public remove( inventoryItem:InventoryItem )
    {
        ARRAY.removeItem( this.pool, inventoryItem );
        ARRAY.removeItem( this.tabs[ inventoryItem.tabKey ], inventoryItem );

        this.unset( inventoryItem );
    }

    public set( inventoryItem:InventoryItem )
    {
        let current : InventoryItem = this.selected[ inventoryItem.tabKey ];

        if( current && current != inventoryItem ) current.unset();
        this.selected[ inventoryItem.tabKey ] = inventoryItem;
    }

    public unset( inventoryItem:InventoryItem )
    {
        if( this.selected[ inventoryItem.tabKey ] == inventoryItem ) delete this.selected[ inventoryItem.tabKey ];
    }
}

export default PlayerInventory;