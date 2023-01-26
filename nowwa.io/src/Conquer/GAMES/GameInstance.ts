import ACCOUNT from "../../Core/TESTS/ACCOUNT";
import { ACTIONS } from "../../Models/ENUM";
import ARRAY from "../../UTIL/ARRAY";
import CONQUER from "../CONQUER";
import LOG, { log } from "../../UTIL/LOG";
import Score from "./Score";
import Turns from "./TURNS/Turns";
import Shop from "./SHOP/Shop";
import GameWallet from "./WALLET/GameWallet";
import PlayerInventory from "./INVENTORY/PlayerInventory";
import DailyRewards from "./DailyRewards";
import GameData from "./DATA/GameData";
import GameAnalytics from "./DATA/GameAnalytics";

class GameInstance
{
    private conquer     : CONQUER;
    public gameID       : any;
    public gameKey      : any;
    public Score        : Score
    public Turns        : Turns;
    public Shop         : Shop;
    public Wallet       : GameWallet;
    public Inventory    : PlayerInventory;
    public DailyRewards : DailyRewards;
    public Data         : GameData;
    public Analytics    : GameAnalytics
 
    constructor( instance:CONQUER, vars:any )
    {
        this.conquer        = instance;
        this.gameID         = vars._id;
        this.gameKey        = vars.gameKey;

        this.Score          = new Score( this.conquer, this.gameID );
        this.Turns          = new Turns( this.conquer, this.gameID );

        this.Shop           = new Shop( this.conquer, this.gameID );
        this.Wallet         = new GameWallet( this.conquer, this.gameID );
        this.Inventory      = new PlayerInventory( this.conquer, this, this.gameID );

        this.DailyRewards   = new DailyRewards( this.conquer, this.gameID );
        this.Data           = new GameData( this.conquer, this.gameID );
        this.Analytics      = new GameAnalytics( this.conquer, this.gameID );
    };
}

export default GameInstance;