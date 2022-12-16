import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import GAME_SHOPITEM from "./GAME_SHOPITEM";
import ARRAY from "../../../UTIL/ARRAY";
import GAME_PLAYERINVENTORY from "./GAME_PLAYERINVENTORY";

class GAME_SHOPTAB
{
    private static table: string = "game_shoptabs";

    /*=============== 


    GET  

    {
        gameID 
    }
    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        let tabs : any          = await DATA.get( this.table, { gameID:query.gameID });
        let output : any        = {};

        for( let n in tabs )
        {
            let tab             = tabs[n];
            output[ tab.key ]   = tab;
            tab.items           = await GAME_SHOPITEM.get({ gameID:query.gameID, tabKey:tab.key });
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
        gameID,
        name,
        key,
        currency,
        price,
        symbol,
        color,
        items?:[]
    }

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        values.key          = query.key || query.name;

        let entry           = await this.getSet( query );

        var values : any    = {};

        values.name         = query.name || query.key;
        values.currency     = query.currency || "Coin";
        values.price        = query.price || 5000;
        values.symbol       = values.key;
        
        await this.change({ where:{ _id:entry._id }, values:values });

        if( query.items ) GAME_SHOPITEM.set( ARRAY.extract( values, query ) );

        return Promise.resolve( entry );
    };

    public static async getSet( query:any ) : Promise<any>
    {
        var vars : any      = { gameID:query.gameID, key:query.key };
        var entry           = await this.getOne( vars );

        if( entry ) return Promise.resolve( vars );

        vars.value          = 0;
 
        if( !entry ) entry  = DATA.set( this.table, vars );

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
        let items : any = await DATA.get( this.table, query ); 

        for( let n in items ) 
        {
            let vars : any = { gameID:items[n].gameID, key:items[n].key };
            await GAME_SHOPITEM.remove( vars );
            await GAME_PLAYERINVENTORY.remove( vars );
        }
 
        let removed = await DATA.remove( this.table, query );
 
        return Promise.resolve( removed );
    };
 
};

export default GAME_SHOPTAB;