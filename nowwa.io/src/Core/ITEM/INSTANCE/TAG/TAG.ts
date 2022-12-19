import DATA from "../../../DATA/DATA";
import LOG, { log } from "../../../../UTIL/LOG";
 

class TAG
{
    private static table : string = "item_instance_tags";

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

    public static async getSet( query:any ) : Promise<any>
    {
        let value = await this.get( query );
        if( !value ) value = await this.set( query );

        return Promise.resolve( value );
    };

    /*=============== 


    SET  

    {
        name
    }
    

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        var item = await DATA.set( this.table, query );
 
        return Promise.resolve( item );
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

export default TAG;