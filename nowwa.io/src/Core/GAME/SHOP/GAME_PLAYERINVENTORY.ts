import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import GAME_SHOPITEM from "./GAME_SHOPITEM";
import ARRAY from "../../../UTIL/ARRAY";
import GAME_CURRENCY from "../WALLET/GAME_CURRENCY";

class GAME_PLAYERINVENTORY
{
    private static table: string = "game_playerinventories";

    /*=============== 


    GET  

    {
        gameID,
        avatarID,
        shopItemKey
    }
    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        let results : any   = await DATA.get( this.table, { gameID:query.gameID, avatarID:query.avatarID } );
        let output : any    = [];

        for( let n in results )
        {
            let inventoryItem   = results[n];
            let shopItem        = await GAME_SHOPITEM.getOne({ gameID:query.gameID, key:results[n].shopItemKey });

            if( !shopItem ) 
            {
                this.remove({ _id:inventoryItem._id });    
                continue;
            }

            ARRAY.extract( inventoryItem, shopItem );
            delete shopItem.shopItemKey;

            output.push( shopItem );
        }
 
        return Promise.resolve( output );
    };
 
 
    /*=============== 


    SET  
    
    {
        avatarID,
        gameID,
        shopItemKey
    }

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let entry = await DATA.set( this.table, query );

        return Promise.resolve( entry );
    };

    public static async buy( query:any ) : Promise<any>
    {
        let shopItem = await GAME_SHOPITEM.getOne({ gameID:query.gameID, key:query.shopItemKey });

        let currency = await GAME_CURRENCY.getOne({ name:shopItem.currency, gameID:query.gameID, avatarID:query.avatarID });

        if( shopItem.price > currency.value ) return Promise.resolve( null );

        GAME_CURRENCY.change( { where:{ _id:currency.id }, values:{ increase:-shopItem.price }});

        let inventoryItem = await this.set( { avatarID:query.avatarID, shopItemKey:query.key, gameID:query.gameID });
 
        return Promise.resolve( inventoryItem );
    };


    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any ) : Promise<any>
    {
        let value = await DATA.change( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query:any ) : Promise<any>
    {
        let removed = await DATA.remove( this.table, query );
 
        return Promise.resolve( removed );
    };
 
};

export default GAME_PLAYERINVENTORY;