import CONQUER from "../CONQUER";
import LOG, { log } from "../../UTIL/LOG";
import { ACTIONS } from "../../Models/ENUM";
import InstanceItem from "./InstanceItem";

class Instances
{
    private conquer : CONQUER;
 
    public constructor( instance:CONQUER ) 
    {
        this.conquer = instance;
    }
 
    /*=============== 
 
    GET  
    {
         
    }

    ================*/

    public async getOne( instanceID:any ) : Promise<any>
    {
        let data : any = await this.conquer.do( ACTIONS.INSTANCE_GETONE, { _id:instanceID } );

        return Promise.resolve( new InstanceItem( this.conquer, data ) );
    };

 
 
}

export default Instances;