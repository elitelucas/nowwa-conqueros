import DATA from "../DATA/DATA";
import LOG, { log } from "../../UTIL/LOG";
import TOURNAMENT_ENTRIES from "./TOURNAMENTS/TOURNAMENT_ENTRIES";
import FRIENDS from "../USER/TRIBE/FRIENDS/FRIENDS";
import QUERY from "../../UTIL/QUERY";
import AVATAR from "../USER/TRIBE/AVATAR";
import ARRAY from "../../UTIL/ARRAY";
import DATE from "../../UTIL/DATE";

class GAMESCORE
{
    private static table: string = "game_scores";

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


    GET special
    
    Everyone
    Friends

    Today
    AllTime
    

    ================*/

    public static async getAllTime( query:any ) : Promise<any>
    {
        query       = QUERY.get( query );
        query.limit = 100;

        query.sort = {
            maxScore: 1 // 1 for ascending, -1 for descending
        };

        // query.where ? maxScore > highest values, sorted down
        // TODO, get 100 results based on maxScore

        let values  = await this.get( query );

        // values      = ARRAY.sort( values, "maxScore" );

        // values.reverse();

        return AVATAR.fill( values );
    };

    public static async getToday( query:any ) : Promise<any>
    {
        let now = new Date(Date.now());
        let today = new Date(now.getTime() - now.getHours()*3600000 - now.getMinutes()*60000 - now.getSeconds()*1000 - now.getMilliseconds());
        query       = QUERY.get( query );
        query.limit = 100;
        query.where = {
            lastChange: {
                $gte: today
            }
        };
        query.sort = {
            score: 1 // 1 for ascending, -1 for descending
        };

        // query.where ?  lastChange < DATE.now() less than one day?
        // TODO, get 100 results when lastChange happened in the last day, sorted by score

        let values  = await this.get( query );

        // values      = ARRAY.sort( values, "score" );

        // values.reverse();

        return AVATAR.fill( values );
    };

    public static async getFriendsAllTime( query:any ) : Promise<any>
    { 
        let friends : any       = FRIENDS.get({ avatarID:query.avatarID });
        let values  : any       = [];

        for( let n in friends )
        {
            let friend      = friends[n];
            let scoreObject = await this.getOne({ gameID:query.gameID, avatarID:friend.avatarID });

            if( scoreObject )
            {
                values.push(
                {
                    avatarID    : friend.avatarID,
                    userPhoto   : friend.userPhoto,
                    firstName   : friend.firstName,
                    score       : scoreObject.score,
                    maxScore    : scoreObject.maxScore
                });
            }
        }
 
        values      = ARRAY.sort( values, "maxScore" );

        values.reverse();

        return Promise.resolve( values );
    };

    public static async getFriendsToday( query:any ) : Promise<any>
    {
        let friends : any       = FRIENDS.get({ avatarID:query.avatarID });
        let values  : any       = [];

        for( let n in friends )
        {
            let friend      = friends[n];
            let scoreObject = await this.getOne({ gameID:query.gameID, avatarID:friend.avatarID });

            if( scoreObject )
            {
                values.push(
                {
                    avatarID    : friend.avatarID,
                    userPhoto   : friend.userPhoto,
                    firstName   : friend.firstName,
                    score       : scoreObject.score,
                    maxScore    : scoreObject.maxScore
                });
            }
        }
 
        values      = ARRAY.sort( values, "score" );

        values.reverse();

        return Promise.resolve( values );
    };


 

    /*=============== 


    SET  

    {
        gameID,
        avatarID,
        maxScore, 
        score 
    }
    

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let entry   = await this.getSet({ gameID:query.gameID, avatarID:query.avatarID });

        if( query.score > entry.maxScore ) entry.maxScore = query.score;
 
        entry       = await this.change( { where:{ _id:entry._id }, values:{ score:entry.score, maxScore:entry.maxScore, vars:query.vars } } );

        if( query.tournamentID || query.tournamentInstanceID ) TOURNAMENT_ENTRIES.set( query );

        return Promise.resolve( entry );
    };

    public static async getSet( query:any ) : Promise<any>
    {
        var vars : any      = { avatarID:query.avatarID, gameID:query.gameID };
        var entry           = await this.getOne( vars );

        if( entry ) return Promise.resolve( entry );

        vars.maxScore       = vars.score = 0;
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

export default GAMESCORE;