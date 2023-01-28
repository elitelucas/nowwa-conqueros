import DATA from "../DATA/DATA";
import LOG, { log } from "../../UTIL/LOG";
import QUERY from "../../UTIL/QUERY";

class GAMEDATA
{
    private static table: string = "game_datas";

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
        avatarID,
        gameID,
        name,
        value
    }

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        if( query.$vars )// {coins:4, shields:4 }
        {
            for( var n in query.$vars ) await this.set( { avatarID:query.avatarID, gameID:query.gameID, name:query.$vars[n].name, value:query.$vars[n].value });
            return Promise.resolve();
        }

        if( !query.where ) query = { where:{ avatarID:query.avatarID, gameID:query.gameID, name:query.name }, values:{ value:query.value }};
 
        let entry = await this.getSet( query );
 
        if( entry.value !== query.values.value ) await this.change({ where:{ _id:entry._id }, values:{ value:query.values.value } });

        return Promise.resolve( entry );
    };

    public static async getSet( query:any ) : Promise<any>
    {
        query = QUERY.get( query );

        var vars : any      = { avatarID:query.where.avatarID, gameID:query.where.gameID, name:query.where.name };
        var entry           = await this.getOne( vars );

        if( entry ) return Promise.resolve( entry );

        vars.value          = query.values ? query.values.value : 0;

        entry               = await DATA.set( this.table, vars );

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

export default GAMEDATA;