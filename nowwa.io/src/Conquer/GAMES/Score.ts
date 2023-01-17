import { ACTIONS } from "../../Models/ENUM";
import ARRAY from "../../UTIL/ARRAY";
import CONQUER from "../CONQUER";
import GameInstance from "./GameInstance";

class Score
{
    private conquer         : CONQUER;
    private query           : any;

    constructor( conquer:CONQUER, gameID:any )
    {
        this.conquer        = conquer;
        this.query          = { gameID:gameID };
    }

    public async set( score:number, vars?:any, tournamentID?:any ) : Promise<any>
    {
        let query               = ARRAY.extract( this.query );

        query.score             = score;
        query.vars              = vars;
        query.tournamentID      = tournamentID;
 
        let value               = await this.conquer.do( ACTIONS.GAMESCORE_SET, query );

        return Promise.resolve( value );
    }

    public async getOne() : Promise<any>
    {
        let value = await this.conquer.do( ACTIONS.GAMESCORE_GET, this.query );
        return Promise.resolve( value );
    }

    public async getAllTime() : Promise<any>
    {
        let values = await this.conquer.do( ACTIONS.GAMESCORE_GETALLTIME, this.query );
        return Promise.resolve( values );
    };

    public async getToday() : Promise<any>
    {
        let values = await this.conquer.do( ACTIONS.GAMESCORE_GETTODAY, this.query );
        return Promise.resolve( values );
    };

    public async getFriendsAllTime() : Promise<any>
    { 
        let values = await this.conquer.do( ACTIONS.GAMESCORE_GETFRIENDSALLTIME, this.query );
        return Promise.resolve( values );
    };

    public async getFriendsToday() : Promise<any>
    {
        let values = await this.conquer.do( ACTIONS.GAMESCORE_GETFRIENDSTODAY, this.query );
        return Promise.resolve( values );
    };

};

export default Score;