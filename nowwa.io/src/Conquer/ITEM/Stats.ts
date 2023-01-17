import CONQUER from "../CONQUER";
import LOG, { log } from "../../UTIL/LOG";
import { ACTIONS } from "../../Models/ENUM";

class Stats
{
    private conquer     : CONQUER;
    private instanceID  : any;
 
    public constructor( instance:CONQUER, instanceID?:any ) 
    {
        this.conquer    = instance;
        this.instanceID = instanceID;
    }
 
 
    public async get( instanceID?:any ) : Promise<any>
    {
        let values : any = await this.conquer.do( ACTIONS.STATS_GETONE, { instanceID:instanceID || this.instanceID } );

        return Promise.resolve( values );
    };
 
 
}

export default Stats;