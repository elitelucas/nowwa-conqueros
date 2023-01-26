import { ACTIONS } from "../../../Models/ENUM";
import CONQUER from "../../CONQUER";
import ARRAY from "../../../UTIL/ARRAY";
 
class GameData
{
    private conquer : CONQUER;
    public tabs     : any;
    private vars    : any = {};
    public data     : any = {};
    private gameID  : any;

    constructor( conquer:CONQUER, gameID:any )
    {
        this.conquer    = conquer;
        this.vars       = { gameID:gameID };
        this.gameID     = gameID;
    }
 
    public async get( vars:any ) : Promise<any>
    {
        vars.gameID = this.gameID;
        let results = this.conquer.do( ACTIONS.GAMEDATA_GET, vars );

        ARRAY.extract( results, this.data );

        return Promise.resolve( results );
    }

    public async set( vars:any ) : Promise<any>
    {
        vars.gameID = this.gameID;
        let results = this.conquer.do( ACTIONS.GAMEDATA_SET, vars );
        return Promise.resolve( results );
    }
}

export default GameData;