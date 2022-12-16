import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import GAME_SHOPITEM from "./GAME_SHOPITEM";
import ARRAY from "../../../UTIL/ARRAY";

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
            delete shopItem.key;

            output.push( shopItem );
        }
 
        return Promise.resolve( output );
    };

    public static async getOne( query: any ) : Promise<any>
    {
        let value = await DATA.getOne( this.table, query );

        return Promise.resolve( value );
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