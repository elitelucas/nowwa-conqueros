import DATA from "../DATA/DATA";
import LOG, { log } from "../../UTIL/LOG";
import TOURNAMENT_ENTRIES from "./TOURNAMENTS/TOURNAMENT_ENTRIES";
import FRIENDS from "../USER/TRIBE/FRIENDS/FRIENDS";

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

    public static async getAllTime() : Promise<any>
    {
        // Get max 100 entries that have gameID, sorted down by maxScore

        let query : any = {};
        let value = await this.get( query );

        return Promise.resolve( value );
    };

    public static async getToday() : Promise<any>
    {
        // Get max 100 entries that have gameID, sorted down by score, when lastEdit happened in the last day

        let query : any = {};
        let value = await this.get( query );

        return Promise.resolve( value );
    };

    public static async getFriendsAllTime( avatarID:any ) : Promise<any>
    { 
        let friends     = FRIENDS.get( { avatarID:avatarID } );
        
        // make list of max 100 friends including avatarID that play this game
        // Get max 100 entries that have gameID, sorted down by maxScore

        let query : any = {};
        let value       = await this.get( query );

        return Promise.resolve( value );
    };

    public static async getFriendsToday( avatarID:any ) : Promise<any>
    {
        let friends     = FRIENDS.get( { avatarID:avatarID } );

        // make list of max 100 friends including avatarID that play this game
        // Get max 100 entries that have gameID, sorted down by score, when lastEdit happened in the last day

        let query : any = {};
        let values      = await this.get( query );

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
        let entry   = await this.getSet( query );

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