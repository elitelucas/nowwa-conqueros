import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import ARRAY from "../../../UTIL/ARRAY";

class STATS
{
    private static table : string = "folders";

    /*=============== 


    GET  
    

    ================*/

    public static async get( query: any ) : Promise<any>
    {
        let value = await DATA.get( this.table, query );

        return Promise.resolve( value );
    };

    public static async getOne( query: any ) : Promise<any>
    {
        let value = await DATA.getOne( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    SET  
    

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let item            = await ( this.getOne( query ) || DATA.set( this.table, { avatarID:query.avatarID, instanceID:query.instanceID } ) );
 
        return this.change( { where:{ _id:item._id }, values:query.values || query } );
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query: any ) : Promise<any>
    {
        let item : any      = this.getOne( query );
        let values : any    = {};

        values.awesome      = item.awesome      || 0;
        values.bullshit     = item.bullshit     || 0;
        values.views        = item.views        || 0;
        values.downloads    = item.downloads    || 0;

        if( query.awesome )     values.awesome  += query.awesome;
        if( query.bullshit )    values.bullshit += query.bullshit;
 
        item                = this.change({ where:{ _id:item._id }, values:values });
 
        let value           = await DATA.change( this.table, query );

        return Promise.resolve( value );
    };
 
    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query: any ) : Promise<any>
    {
        let remove = await DATA.remove( this.table, query );

        return Promise.resolve( remove );
    };
 
};

export default STATS;