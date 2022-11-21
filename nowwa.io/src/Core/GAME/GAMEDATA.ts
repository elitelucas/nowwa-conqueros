import DATA from "../DATA/DATA";
import LOG, { log } from "../../UTIL/LOG";

class GAMEDATA
{
    private static table: string = "game_datas";

    /*=============== 


    GET  
    

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
        if( query.$vars )
        {
            for( var n in query.$vars ) await this.set({ avatarID:query.avatarID, gameID:query.gameID, name:query.$vars[n].name, value:query.$vars[n].value });
            return Promise.resolve();
        }
 
        let entry = await this.getSet( query );
        
        await this.change({ where:{ _id:entry._id }, values:{ value:query.value } });

        return Promise.resolve( entry );
    };

    public static async getSet( query:any ) : Promise<any>
    {
        var vars : any      = { avatarID:query.avatarID, gameID:query.gameID, name:query.name };
        var entry           = await this.getOne( vars );

        if( entry ) return Promise.resolve( entry );

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
        let removed = await DATA.remove( this.table, query );
 
        return Promise.resolve( removed );
    };
 
};

export default GAMEDATA;