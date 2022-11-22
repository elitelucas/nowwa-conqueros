import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import TOURNAMENT_ENTRIES from "./TOURNAMENT_ENTRIES";
import TOURNAMENT_INSTANCES from "./TOURNAMENT_INSTANCES";
import DATE from "../../../UTIL/DATE";

class TOURNAMENT
{
    private static table: string = "game_tournaments";

    /*=============== 


    GET  
    

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
        name,
        startDate (now),
        endDate (now+7),
        days (dynamic),
        capacity,
        recursive
    }

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        query.name          = query.name || "Tournament";
        query.startDate     = query.startDate || DATE.now();
        query.duration      = query.duration || ( query.endDate ? ( query.endDate-query.startDate ) : 7 );
        query.endDate       = query.endDate || query.startDate + query.duration;
        query.capacity      = query.capacity || 100;
        query.lenght        = 0;
        query.cummulative   = query.cummulative || false;
        query.recursive     = query.recursive || false;
 
        let value           = await DATA.set( this.table, query );

        let instance        = TOURNAMENT_INSTANCES.get({ tournamentID:value._id });

        return Promise.resolve( value );
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
        let items   = await DATA.get( this.table, query ); 

        for( let n in items ) await TOURNAMENT_INSTANCES.remove({ tournamentID:items[n]._id });
 
        return Promise.resolve();
    };
 
};

export default TOURNAMENT;