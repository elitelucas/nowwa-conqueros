import CONQUER from "../CONQUER";
import LOG, { log } from "../../UTIL/LOG";
import { ACTIONS } from "../../Models/ENUM";

class Awesome
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
        let values : any = await this.conquer.do( ACTIONS.AWESOME_GETONE, { instanceID:instanceID || this.instanceID } );

        return Promise.resolve( values );
    };

    /*=============== 
 
    SET  
    {
        awesome : -1, 0, 1
    }

    ================*/

    private async set( awesome:number, instanceID?:any ) : Promise<any>
    {
        let values : any = await this.conquer.do( ACTIONS.AWESOME_SET, { instanceID:instanceID || this.instanceID, awesome:awesome } );

        return Promise.resolve( values );
    };

    public async awesome( instanceID?:any ) : Promise<any>
    {
        return this.set( 1, instanceID );
    }

    public async bullshit( instanceID?:any ) : Promise<any>
    {
        return this.set( -1, instanceID );
    }

    public async remove( instanceID?:any ) : Promise<any>
    {
        return this.set( 0, instanceID );
    }
 
}

export default Awesome;