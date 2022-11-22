import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import TOURNAMENT from "./TOURNAMENT";
import TOURNAMENT_INSTANCES from "./TOURNAMENT_INSTANCES";

class TOURNAMENT_ENTRIES
{
    private static table: string = "game_tournament_entries";

    /*=============== 


    GET  
    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        // SORTED

        let values = await DATA.get( this.table, query );

        return Promise.resolve( values );
    };

    public static async getOne( query:any ) : Promise<any>
    {
        let value = await DATA.getOne( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    SET  
    

    ================*/

    public static async set( query:any ) : Promise<any>
    { 
        let tournamentInstanceID        = query.tournamentInstanceID;
  
        if( !tournamentInstanceID ) return Promise.resolve();
 
        let tournamentInstance : any    = TOURNAMENT_INSTANCES.getOne({ _id:tournamentInstanceID });
        let tournament : any            = TOURNAMENT.getOne({ _id:tournamentInstance.tournamentID });
 
        let scoreEntry                  = await this.getSet( { avatarID:query.avatarID, tournamentInstanceID:tournamentInstanceID });

        var newScore                    = query.score;
        var oldScore                    = scoreEntry.score || 0;

        newScore                        = tournament.cummulative ? ( newScore + oldScore ) : ( newScore > oldScore ? newScore : oldScore );

        scoreEntry                      = await this.change( { where:{ _id:scoreEntry._id }, values:{ vars:query.vars, score:query.score } } );

        return Promise.resolve( scoreEntry );
    };

    public static async getSet( query:any ) : Promise<any>
    {
        var vars : any      = { avatarID:query.avatarID, tournamentInstanceID:query.tournamentInstanceID };
        var entry           = await this.getOne( vars );

        if( entry ) return Promise.resolve( entry );
 
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

export default TOURNAMENT_ENTRIES;