import DATA from "../DATA/DATA";
import LOG, { log } from "../../UTIL/LOG";
import TOURNAMENT from "./TOURNAMENTS/TOURNAMENT";
import GAMEDATA from "./GAMEDATA";
import GAMEPLAYER from "./GAMEPLAYER";
import GAMESCORE from "./GAMESCORE";
import GAMEROOM from "./GAMEROOM";
import MATCHMAKING from "./MATCHMAKING";
import GAMETURN from "./GAMETURN";

class GAME
{
    private static table: string = "games";

    /*=============== 


    GET  
    

    ================*/

    public static async get( query: any ) : Promise<any>
    {
        let value = await DATA.get( this.table, query );

        return Promise.resolve( value );
    };

    public static async getOne( query: any ) : Promise<any>
    {
        let value = await DATA.getOne( this.table, query );

        return Promise.resolve( value );
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

    public static async change( query: any ) : Promise<any>
    {
        let value = await DATA.change( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query:any ) : Promise<any>
    {
        let items : any = await DATA.get( this.table, query ); 

        for( let n in items ) 
        {
            let vars : any = { gameID:items[n].gameID };
   
            await TOURNAMENT.remove( vars );
            await GAMEDATA.remove( vars );
            await GAMEPLAYER.remove( vars );
            await GAMESCORE.remove( vars );
            await GAMEROOM.remove( vars );
            await MATCHMAKING.remove( vars );
            await GAMETURN.remove( vars );
        }
 
        let removed = await DATA.remove( this.table, query );
 
        return Promise.resolve( removed );
    };
 
};

export default GAME;