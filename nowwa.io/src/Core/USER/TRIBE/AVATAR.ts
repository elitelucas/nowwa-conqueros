import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import QUERY from "../../../UTIL/QUERY";

class AVATAR
{
    private static table : string = "avatars";

    /*=============== 


    GET  
    

    ================*/

    public static async get( vars:any ) : Promise<any>
    {
        var results = await DATA.get( this.table, QUERY.get( vars ) );

        return Promise.resolve( results );
    };

    public static async getOne( vars:any ) : Promise<any>
    {
        let avatar              = await DATA.getOne( this.table, QUERY.get( vars ) );
        if( !avatar ) avatar    = await this.set( vars );

        return Promise.resolve( avatar );
    };


    /*=============== 


    SET  

    {
        uID,
        firstName
        lastName,
        picture,
    }
 
    ================*/

    public static async set( vars:any ) : Promise<any>
    {
        let avatar = await DATA.set( this.table, QUERY.set( vars ) );
 
        return Promise.resolve( avatar );
    };



    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any ) : Promise<any>
    {

    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query:any ) : Promise<any>
    {
        query = QUERY.get( query );

        if( query.where.uID )
        {
            let results = this.get( { uId:query.uID } );

            for( let n in results )
            {
                // remove FOLDERS, ITEMS
            }
        }

        if( query.where._id )
        {
            let results = this.get( { _id:query._id } );

            for( let n in results )
            {
                // remove FOLDERS, ITEMS
            }
        }
 
        await DATA.remove( this.table, query );
        return Promise.resolve(); 
    };

   

};

export default AVATAR;