import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import QUERY from "../../../UTIL/QUERY";
import STATS from "./STATS";

class AWESOME
{
    public static table : string = "item_instance_awesomes";

    /*=============== 


    GET  
    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        let values = await DATA.get( this.table, query );

        return Promise.resolve( values );
    };

    public static async getOne( query:any ) : Promise<any>
    {
        let value = await DATA.getOne( this.table, query );

        return Promise.resolve( value );
    };
 
    /*=============== 
 
    SET  
    
    {
        instanceID,
        avatarID,
        awesome (-1,0,1) dislike, neutral, like
    }

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let where : any     = { avatarID:query.avatarID, instanceID:query.instanceID };
        let item            = await ( this.getOne( where ) || DATA.set( this.table, where ) );

        return this.change( { where:{ _id:item._id, values:query }} );
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any ) : Promise<any>
    {
        query           = QUERY.change( query );

        let item : any  = this.changeStats( query );

        item = await DATA.change( this.table, { where:{ _id:item._id }, values:{ awesome:query.values.awesome } } );

        return Promise.resolve( item );
    };

    private static async changeStats( query:any ) : Promise<any>
    {
        let item        : any = this.getOne( query.where );
 
        let lastValue   : number = item.awesome || 0;
        let currValue   : number = query.values.awesome;

        if( lastValue == currValue ) return Promise.resolve( item );

        let awesome     : number = currValue == 1 ? 1 : ( lastValue == 1 ? - 1 : 0 );
        let bullshit    : number = currValue == -1 ? 1 : ( lastValue == -1 ? - 1 : 0 );
 
        STATS.set(
        {
            instanceID  : item.instanceID,
            avatarID    : item.avatarID,
            awesome     : awesome,
            bullshit    : bullshit
        }); 

        return Promise.resolve( item );
    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query:any, isForced?:boolean ) : Promise<any>
    {
        let results = await this.get( query );

        if( !isForced )
        {
            for( var n in results ) await this.changeStats( { where:{ _id:results[n]._id }, values:{ awesome:0 } })
        }
 
        let removed = await DATA.remove( this.table, query );

        return Promise.resolve( removed );
    };
 
};

export default AWESOME;