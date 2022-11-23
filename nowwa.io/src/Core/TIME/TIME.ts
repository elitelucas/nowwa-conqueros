import RANDOM from "../../UTIL/RANDOM";
import LOG, { log } from "../../UTIL/LOG";
import STRING from "../../UTIL/STRING";
import DATA from "../DATA/DATA";
 
class TIME
{
    private static table: string = "times";

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
}

export default TIME;