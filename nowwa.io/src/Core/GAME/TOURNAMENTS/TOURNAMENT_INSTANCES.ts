import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import TOURNAMENT_ENTRIES from "./TOURNAMENT_ENTRIES";
import TOURNAMENT from "./TOURNAMENT";
import DATE from "../../../UTIL/DATE";

class TOURNAMENT_INSTANCES
{
    private static table: string = "game_tournament_instances";

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

    public static async getAvailable( tournamentID:any ) : Promise<any>
    {
        let rules       = await TOURNAMENT.getOne( { _id:tournamentID } );

        var instance    = await this.getOne(
        {
            tournamentID : tournamentID,

            // where length < rules.capacity
            //length       :
            // where endDate is <= DATE.now()
        })

        if( !instance )
        {
            // get new start date by original rules startDate - current date in days, plus duration. Or is there a better way?
        
            let startDate   = DATE.now();
            let endDate     = startDate + rules.duration;

            instance        = await this.set(
            { 
                startDate       : startDate, 
                endDate         : endDate,
                tournamentID    : tournamentID,
                length          : 0
            });
        }
        
        return Promise.resolve( instance );
    };

    /*=============== 


    SET  
    

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let value = await DATA.set( this.table, query );

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

        for( let n in items ) await TOURNAMENT_ENTRIES.remove({ tournamentInstanceID:items[n]._id });
 
        return Promise.resolve();
    };
 
};

export default TOURNAMENT_INSTANCES;