import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import ARRAY from "../../../UTIL/ARRAY";
import GAMETURN from "./GAMETURN";

class GAMETURN_ENTRIES
{
    private static table: string = "game_turn_entries";

    /*=============== 


    GET  
    
    {
        turnID
    }

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        // sort by timestamp 

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
 

    /*=============== 


    SET  
    
    {
        turnID,
        avatarID (sender),
        finishTurn (boolean),
        finishGame (boolean),
        currentTurn
    }

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let turnID              = query.turnID
        let avatarID            = query.avatarID;
  
        let turn                = await GAMETURN.get({ _id:turnID });
 
        let avatarIDs           = turn.avatarIDs;
 
        if( query.finishTurn )
        {
            var index = avatarIDs.indexOf( avatarID ) + 1;
            if( index >= avatarIDs.length ) index = 0;
            turn.currentTurn = avatarIDs[index];
        }
 
        // can we push just one without rewriting the whole turns?

        let turnData            = query.turnData;
 
        turnData.avatarID       = avatarID;
 
        await DATA.set( this.table, turnData );


        for( var n in turn.avatarIDs ) if( turn.avatarIDs[n] != avatarID )
        {
            // send push notification to turn.avatarIDs[n]
        }
       
 
        turn                    = await DATA.change( this.table, { where:{ _id:turnID }, values:{ currentTurn:turn.currentTurn } } );
 
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

export default GAMETURN_ENTRIES;