import DATA from "../DATA/DATA";
import LOG, { log } from "../../UTIL/LOG";
import FILE from "./FILE";

class IMAGE
{
    private static table : string = "images";

    /*=============== 


    GET  

    // This needs a GET method that receives a file and witdh & height, and returns a cached file if it exists or crops it on the fly
    

    ================*/

    public static async get( query:any ) : Promise<any>
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
        let results : any   = await DATA.get( this.table, query ); 

        for( let n in results ) FILE.remove({ itemID:results[n].itemID });
 
        let removed         = await DATA.remove( this.table, query );

        return Promise.resolve( removed );
    };
 
};

export default IMAGE;