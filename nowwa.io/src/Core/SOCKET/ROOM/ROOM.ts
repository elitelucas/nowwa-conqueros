import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import ROOM_ENTRIES from "./ROOM_ENTRIES";

class ROOM
{
    private static table: string = "rooms";

    /*=============== 


    GET  
    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        let value = await DATA.get( this.table, query );

        return Promise.resolve( value );
    };

    public static async getOne( query:any ) : Promise<any>
    {
        let value = await DATA.getOne( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    SET  
    

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let value = await DATA.set( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any ) : Promise<any>
    {
        let value = await DATA.change( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query:any ) : Promise<any>
    {
        let results   = await DATA.get( this.table, query ); 

        for( let n in results ) await ROOM_ENTRIES.remove({ roomID:results[n]._id })
 
        let removed = await DATA.remove( this.table, query );

        return Promise.resolve( removed );
    };
 
};

export default ROOM;