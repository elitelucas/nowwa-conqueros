import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import ARRAY from "../../../UTIL/ARRAY";

class GAMETURN
{
    private static table : string = "game_turns";

    /*=============== 


    GET  
    
    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        // needs a flag to not return turnData

        //query = { where:{ gameID:1, avatarID:2 }, values:{ } };

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
        avatarIDs [],
        maxTurns (optional),
        turnData [],
        currentTurn,
        avatarID (sender),
        status,
        finished []
    }

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        query.turnData      = [];
        query.maxTurns      = query.maxTurns || 99999;
        query.currentTurn   = query.avatarID;
        query.finished      = [];
        query.viewedResults = [];
        query.status        = 'active';

        delete query.avatarID;
        
        let value           = await DATA.set( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    CHANGE  
    

    {
        turnID,
        avatarID (sender),
       // turnData {},
        finishTurn (boolean),
        finishGame (boolean),
        viewedResults[],
        viewResults,
        currentTurn
    }

    ================*/

    public static async change( query:any ) : Promise<any>
    {
        let turnID              = query.turnID
        let avatarID            = query.avatarID;
  
        let turn                = await this.get({ _id:turnID });
 
        let avatarIDs           = turn.avatarIDs;
 
        if( query.finishTurn )
        {
            var index = avatarIDs.indexOf( avatarID ) + 1;
            if( index >= avatarIDs.length ) index = 0;
            turn.currentTurn = avatarIDs[index];
        }
 
        // can we push just one without rewriting the whole turns?

        let turnData            = query.turnData;

        if( turnData )
        {
            turnData.avatarID       = avatarID;
            turn.turnData.push( turnData );

            for( var n in turn.avatarIDs ) if( turn.avatarIDs[n] != avatarID )
            {
                // send push notification to turn.avatarIDs[n]
            }
        }

        if( query.finishGame )
        {
            ARRAY.pushUnique( turn.finished, avatarID );
 
            if( turn.finished.length >= turn.avatarIDs.length )
            {
                turn.status         = "finished";
                query.viewResults   = true;
            }
        }

        if( query.viewResults )
        {
            ARRAY.pushUnique( turn.viewedResults, avatarID );
            if( turn.viewedResults.length >= avatarIDs.length ) return this.remove( { _id:turnID });
        }
 
        turn                    = await DATA.change( this.table, { where:{ _id:turnID }, values:turn } );
 
        return Promise.resolve( turn );
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

export default GAMETURN;