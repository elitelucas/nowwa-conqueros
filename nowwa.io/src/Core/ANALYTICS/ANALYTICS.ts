import DATA from "../DATA/DATA";
import LOG, { log } from "../../UTIL/LOG";
import ARRAY from "../../UTIL/ARRAY";

class ANALYTICS
{
    private static table: string = "analytics";

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

    public static async set( query: any ) : Promise<any>
    {
        if( query.$vars )// {coins:4, shields:4 }
        {
            let $vars = query.$vars;
            delete query.$vars;

            for( var n in $vars ) await this.set( ARRAY.extract( query, { label:$vars[n].label, value:$vars[n].value } ) );
            return Promise.resolve();
        }

        let value = await DATA.set( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query: any ) : Promise<any>
    {
        let value = await DATA.change( this.table, query );

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

export default ANALYTICS;