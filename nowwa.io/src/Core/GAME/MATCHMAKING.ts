import DATA from "../DATA/DATA";
import LOG, { log } from "../../UTIL/LOG";
import ARRAY from "../../UTIL/ARRAY";

class MATCHMAKING
{
    private static table: string = "game_matchmakings";

    /*=============== 


    GET  

    {
        gameID,

    }
    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        let value = await DATA.get( this.table, query );

        return Promise.resolve( value );
    };

    public static async getOne( query:any ) : Promise<any>
    {
        let value = await DATA.getOne( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    SET  

    {
        gameID,
        capacity,
        users,
        length,
        level (optional)
        avatarID
    }
    

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let value = await this.getSet( query );

        ARRAY.pushUnique( value.users, query.avatarID );

        await this.change( { where:{ _id:value._id }, values:value } );
 
        return Promise.resolve( value );
    };

    private static async getSet( query:any ) : Promise<any>
    {
        // where length is < capacity
        var vars : any      = { gameID:query.gameID, level:query.level };
        var entry           = await this.getOne( vars );

        if( entry ) return Promise.resolve( entry );

        vars.users  = [];
        vars.length = 0;
 
        entry       = DATA.set( this.table, vars );

        return Promise.resolve( entry );
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any ) : Promise<any>
    {
        query.values.length = query.values.users.length;

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

export default MATCHMAKING;