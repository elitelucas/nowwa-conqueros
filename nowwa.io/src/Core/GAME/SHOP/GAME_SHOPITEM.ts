import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";

class GAME_SHOPITEM
{
    private static table: string = "game_shopitems";

    /*=============== 


    GET  

    {
        gameID,
        avatarID
    }
    

    ================*/

    public static async get( query: any ) : Promise<any>
    {
        let results : any   = await DATA.get( this.table, query );
        let vars : any      = {};

        for( var n in results ) vars[ results[n].name ] = results[n].value;
 
        return Promise.resolve( vars );
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
        tabKey,
        key,
        name (title),
        amount : 0,
        price
        metadata
    }

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let items = query.items;

        if( !items ) return this.getSet( query );

        await this.remove({ gameID:query.gameID, tabKey:query.tabKey });

        let output : any = [];

        for( let n in items )
        {
            let item        = items[n];

            item.currency   = item.currency || query.currency || "Coin";
            item.tabKey     = item.tabKey || query.key;
            item.price      = item.price || query.price || 5000;
            item.amount     = item.amount || 0;
            item.metadata   = item.metadata || null;
            item.key        = item.key || item.name || query.key + n;
            item.name       = item.name || item.key; 
            item.ad         = item.ad || null;

            let entry       = await DATA.set( this.table, item );

            output.push( entry );
        }

        return Promise.resolve( output );
    };

    public static async getSet( query:any ) : Promise<any>
    {
        var vars : any      = { gameID:query.gameID, itemKey:query.itemKey };
        var entry           = await this.getOne( vars );

        if( entry ) return this.change({ where:{ _id:entry._id }, values:query });
        if( !entry ) entry  = DATA.set( this.table, query );

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

export default GAME_SHOPITEM;