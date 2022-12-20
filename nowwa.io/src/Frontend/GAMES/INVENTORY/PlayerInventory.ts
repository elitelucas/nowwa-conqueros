 
import CONQUER from "../../CONQUER";
import { ACTIONS } from "../../../Models/ENUM";
import InventoryItem from "./InventoryItem";
import ARRAY from "../../../UTIL/ARRAY";
import GameInstance from "../GameInstance";

class PlayerInventory
{
    private conquer     : CONQUER;
    private gameID      : any;

    public pool         : any;
    public tabs         : any;
    public selected     : any;

    private gameInstance : GameInstance;

    constructor( conquer:CONQUER, gameInstance:GameInstance, gameID:any )
    {
        this.conquer        = conquer;
        this.gameInstance   = gameInstance;
        this.gameID         = gameID; 

        this.get();
    }

    public async get( force?:boolean ) : Promise<any>
    {
        if( this.pool && !force ) return Promise.resolve( this.pool );

        let data = await this.conquer.do( ACTIONS.GAME_PLAYERINVENTORY_GET, { gameID:this.gameID } )

        this.pool = [];
        this.tabs = {};
        this.selected = {};

        for( let n in data ) this.push( data[n] );
 
        return Promise.resolve( this.pool );
    }

    private push( itemData:any )
    {
        let item = new InventoryItem( this.conquer, this, itemData );

        this.pool.push( item );

        if( !this.tabs[ item.tabKey ] ) this.tabs[ item.tabKey ] = [];
        this.tabs[ item.tabKey ].push( item );

        if( item.selected ) this.selected[ item.tabKey ] = item;

        return item;
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
 
    public async buy( shopItemKey:any ) : Promise<any>
    {
        let itemData = await this.conquer.do( ACTIONS.GAME_PLAYERINVENTORY_BUY, { gameID:this.gameID, shopItemKey:shopItemKey });

        if( !itemData ) return Promise.resolve( null );

        this.gameInstance.Wallet.getCurrency( this.gameInstance.Shop.data[ shopItemKey ].currency );

        return Promise.resolve( this.push( itemData ) );
    }
}

export default PlayerInventory;