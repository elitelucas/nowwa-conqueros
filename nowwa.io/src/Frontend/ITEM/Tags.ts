import CONQUER from "../CONQUER";
import LOG, { log } from "../../UTIL/LOG";
import { ACTIONS } from "../../Models/ENUM";

class Tags
{
    private conquer     : CONQUER;
    private instanceID  : any;
 
    public constructor( instance:CONQUER, instanceID?:any ) 
    {
        this.conquer    = instance;
        this.instanceID = instanceID;
    }
 
    /*=============== 
 
    GET  
    {
         
    }

    ================*/

    public async get( instanceID?:any ) : Promise<any>
    {
        let values : any = await this.conquer.do( ACTIONS.TAG_ASSOCIATIONS_GET, { instanceID:instanceID || this.instanceID } );

        return Promise.resolve( values );
    };

    /*=============== 
 
    SET  
    {
         
    }

    ================*/

    public async set( instanceID:any, tags:any ) : Promise<any>
    {
        let values : any = await this.conquer.do( ACTIONS.TAG_ASSOCIATIONS_SET, { instanceID:instanceID, tags:tags } );

        return Promise.resolve( values );
    };
 
}

export default Tags;