import { ACTIONS } from "../../../Models/ENUM";
import ARRAY from "../../../UTIL/ARRAY";
import CONQUER from "../../CONQUER";
import TurnsInstance from "./TurnsInstance";

class Turns
{
    private conquer         : CONQUER;
    private query           : any;
    public pool             : any = [];

    constructor( conquer:CONQUER, gameID:any )
    {
        this.conquer        = conquer;
        this.query          = { gameID:gameID };
    }

    public async set( friendID:any ) : Promise<any>
    {
        let query               = ARRAY.extract( this.query );

        query.avatarIDs         = Array.isArray( friendID ) ? friendID : [ friendID ];
 
        let value               = await this.conquer.do( ACTIONS.GAMETURN_SET, query );

        return Promise.resolve( new TurnsInstance( this.conquer, value ) );
    }

    public async get() : Promise<any>
    {
        let values = await this.conquer.do( ACTIONS.GAMETURN_GET, this.query );

        let output = [];

        for( let n in values ) output.push( new TurnsInstance( this.conquer, values[n] ));

        return Promise.resolve( output );
    }
 

};

export default Turns;