import ACCOUNT from "../../Core/TESTS/ACCOUNT";
import { ACTIONS } from "../../Models/ENUM";
import ARRAY from "../../UTIL/ARRAY";
import CONQUER from "../CONQUER";
import LOG, { log } from "../../UTIL/LOG";
import Score from "./Score";
import Turns from "./TURNS/Turns";
import Shop from "./SHOP/Shop";

class GameInstance
{
    private conquer     : CONQUER;
    public gameID       : any;
    public gameKey      : any;
    private Score       : Score
    private Turns       : Turns;
    public Shop         : Shop;
 
    constructor( instance:CONQUER, vars:any )
    {
        this.conquer        = instance;
        this.gameID         = vars._id;
        this.gameKey        = vars.gameKey;

        this.Score          = new Score( this.conquer, this.gameID );
        this.Turns          = new Turns( this.conquer, this.gameID );

        this.Shop           = new Shop( this.conquer, this.gameID );
 
 
    };

  
 
 
}

export default GameInstance;