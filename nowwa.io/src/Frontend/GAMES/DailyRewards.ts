import { ACTIONS } from "../../Models/ENUM";
import ARRAY from "../../UTIL/ARRAY";
import CONQUER from "../CONQUER";
import GameInstance from "./GameInstance";

class DailyRewards
{
    private conquer         : CONQUER;
    private query           : any;

    constructor( conquer:CONQUER, gameID:any )
    {
        this.conquer        = conquer;
        this.query          = { gameID:gameID };
    }

    public async set() : Promise<any>
    {
        let value               = await this.conquer.do( ACTIONS.GAME_DAILYREWARDS_SET, this.query );
        return Promise.resolve( value );
    }

    public async get() : Promise<any>
    {
        let value = await this.conquer.do( ACTIONS.GAME_DAILYREWARDS_GET, this.query );
        return Promise.resolve( value );
    }

 

};

export default DailyRewards;