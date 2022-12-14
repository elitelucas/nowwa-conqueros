import { ACTIONS } from "../../../Models/ENUM";
import ARRAY from "../../../UTIL/ARRAY";
import CONQUER from "../../CONQUER";

class TurnsInstance
{
    private conquer         : CONQUER;
    private gameID          : any;

    public turnData         : any;
    public maxTurns         : number = 9999;
    public currentTurn      : any;
    public finished         : any;
    public viewedResults    : any;
    public status           : string = "waiting";

    private query           : any;

    constructor( conquer:CONQUER, params:any )
    {
        this.conquer    = conquer;
        this.query      = { turnID:params._id };

        this.fill( params );
    }

    private fill( params:any )
    {
        this.maxTurns       = params.maxTurns;
        this.turnData       = params.turnData || [];
        
        this.viewedResults  = params.viewedResults;
        this.finished       = params.finished;
        this.currentTurn    = params.currentTurn;
        this.status         = params.status;

        return this;
    };

    public async get() : Promise<any>
    {
        let value = await this.conquer.do( ACTIONS.GAMETURN_GETONE, this.query );
       
        return Promise.resolve( this.fill( value ) );
    };

    public async set( turnData:any, finishTurn?:boolean, finishGame?:boolean, viewResults?:boolean ) : Promise<any>
    {
        return this.do({ turnData:turnData, finishTurn:finishTurn, finishGame:finishGame, viewResults:viewResults });
    }

    public async finishGame() : Promise<any>
    {
        return this.do({ finishGame:true });
    }

    public async finishTurn() : Promise<any>
    {
        return this.do( { finishTurn:true } );
    }

    public async viewResults() : Promise<any>
    {
        return this.do( { viewResults:true } );
    }

    private async do( query:any ) : Promise<any>
    {
        let value = await this.conquer.do( ACTIONS.GAMETURN_CHANGE, ARRAY.extract( this.query, query ) );
        return Promise.resolve( this.fill( value ) );
    };

    


};

export default TurnsInstance;

