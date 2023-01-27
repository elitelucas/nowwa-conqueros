import { ACTIONS } from "../../Models/ENUM";
import ARRAY from "../../UTIL/ARRAY";
import DATE from "../../UTIL/DATE";
import CONQUER from "../CONQUER";

class Analytics
{
    private conquer     : CONQUER;
    private vars        : any = {};

    constructor( conquer:CONQUER )
    {
        this.conquer = conquer;
    };

    public setPayload( object:any )
    {
        this.vars = object;
    };

    public async get( vars:any ) : Promise<any>
    {
        let values = await this.conquer.do( ACTIONS.ANALYTICS_GET, vars );
        return Promise.resolve( values );
    }

    public set( label:string, value?:any )
    {
        this.conquer.do( ACTIONS.ANALYTICS_SET, ARRAY.extract( this.vars, { label:label, value:value } ) )
    }

    public onEntryPoint()
    {
        // add other variables
        this.set( "onEntryPoint" );
    }
 
};

export default Analytics;