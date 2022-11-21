import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";

class TRIBE_MEMBERS
{
    private static table : string = "tribe_members";

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
    
    {
        avatarID,
        tribeID,
        status (active, invited, pending ),
        hidden ( boolean, used for stuff like friends lists )

    }

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let value = await DATA.set( this.table, query );

        return Promise.resolve( value );
    };

    public static async getSet( query:any ) : Promise<any>
    {
        var vars : any      = { avatarID:query.avatarID, tribeID:query.tribeID };
        var entry           = await this.getOne( vars );

        if( entry ) return Promise.resolve( entry );
 
        if( !entry ) entry  = this.set( vars );

        return Promise.resolve( entry );
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
        let remove = await DATA.remove( this.table, query );

        return Promise.resolve( remove );
    };
 
};

export default TRIBE_MEMBERS;