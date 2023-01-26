import DATA from "../DATA/DATA";
import LOG, { log } from "../../UTIL/LOG";
import TOURNAMENT from "./TOURNAMENTS/TOURNAMENT";
import GAMEDATA from "./GAMEDATA";
import GAMEPLAYER from "./GAMEPLAYER";
import GAMESCORE from "./GAMESCORE";
import GAMEROOM from "./GAMEROOM/GAMEROOM";
import MATCHMAKING from "./MATCHMAKING";
import GAMETURN from "./GAMETURNS/GAMETURN";
import GAME_SHOPITEM from "./SHOP/GAME_SHOPITEM";
import GAME_SHOPTAB from "./SHOP/GAME_SHOPTAB";
import DAILYREWARDS from "./DAILYREWARDS/DAILYREWARDS";

class GAME
{
    private static table : string = "games";

    /*=============== 


    GET  
    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        let values = await DATA.get( this.table, query );

        return Promise.resolve( values );
    };

    public static async getOne( query:any ) : Promise<any>
    {
        let value = await DATA.getOne( this.table, query );

        if( !value ) value = await this.set({ gameKey:query.gameKey });

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
            let vars : any = { gameID:items[n]._id };
   
            await TOURNAMENT.remove( vars );
            await GAMEDATA.remove( vars );
            await GAMEPLAYER.remove( vars );
            await GAMESCORE.remove( vars );
            await GAMEROOM.remove( vars );
            await MATCHMAKING.remove( vars );
            await GAMETURN.remove( vars );
            await GAME_SHOPTAB.remove( vars );
            await DAILYREWARDS.remove( vars );
        }
 
        let removed = await DATA.remove( this.table, query );
 
        return Promise.resolve( removed );
    };
 
};

export default GAME;