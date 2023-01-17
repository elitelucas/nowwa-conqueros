import { ACTIONS } from "../../Models/ENUM";
import CONQUER from "../CONQUER";
import GameInstance from "./GameInstance";

class Games
{
    private conquer : CONQUER;

    public constructor( instance:CONQUER ) 
    {
        this.conquer = instance;
    }
 
    /*=============== 


    GET
    

    ================*/

    public async getOne( gameKey:any ) : Promise<any>
    {
        let vars = await this.conquer.do( ACTIONS.GAME_GETONE, { gameKey:gameKey });
        return Promise.resolve( new GameInstance( this.conquer, vars ));
    };


}

export default Games;