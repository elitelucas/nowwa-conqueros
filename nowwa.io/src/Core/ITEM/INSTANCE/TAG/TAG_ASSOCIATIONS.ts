import DATA from "../../../DATA/DATA";
import LOG, { log } from "../../../../UTIL/LOG";
import QUERY from "../../../../UTIL/QUERY";
import TAG from "./TAG";

class TAG_ASSOCIATIONS
{
    private static table : string = "item_instance_tag_associations";

    /*=============== 


    GET  
    

    ================*/

    public static async get( query: any ) : Promise<any>
    {
        let values = await DATA.get( this.table, query );
        let output = [];

        for( let n in values )
        {
            let tag = await TAG.getOne( { _id: values[n].tagID });
            output.push( tag.name );
        }

        return Promise.resolve( output );
    };

    public static async getSet( query: any ) : Promise<any>
    {
        let value = await this.get( query );
        if( !value ) value = await this.set( query );

        return Promise.resolve( value );
    };


    /*=============== 


    SET  
    
    {
        instanceID,
        tagID,

        tags[]
    }

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        if( query.tagID ) return DATA.set( this.table, query );
 
        await this.remove( { instanceID:query.instanceID } );

        for( var n in query.tags )
        {
            let tagItem : any = await TAG.getSet( { name:query.tags[n] } );
 
            await this.getSet( { instanceID:query.instanceID, tagID: tagItem._id } );
        }
 
        return Promise.resolve();
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

export default TAG_ASSOCIATIONS;