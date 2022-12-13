import ACCOUNT from "../../Core/TESTS/ACCOUNT";
import { ACTIONS } from "../../Models/ENUM";
import ARRAY from "../../UTIL/ARRAY";
import CONQUER from "../CONQUER";
import LOG, { log } from "../../UTIL/LOG";

class GameInstance
{
    private conquer     : CONQUER;
    public gameID       : any;
    public gameKey      : any;
 
 
    constructor( instance:CONQUER, vars:any )
    {
        this.conquer        = instance;
        this.gameID         = vars._id;
        this.gameKey        = vars.gameKey;

        log("new game instance", vars );
 
    };

  
 
 
}

export default GameInstance;