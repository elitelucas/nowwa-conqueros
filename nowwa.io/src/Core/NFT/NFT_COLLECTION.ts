import DATA from "../DATA/DATA";
import LOG, { log } from "../../UTIL/LOG";

class NFT_COLLECTION
{
    private static table : string = "nft_collections";

    /*=============== 


    GET  

    {
 
    }
    

    ================*/

    public static async get( query?: any ) : Promise<any>
    {
        let results : any   = await DATA.get( this.table, query );
 
        return Promise.resolve( results );
    };

    public static async getOne( query?: any ) : Promise<any>
    {
        let result = 
        {
            name            : "testCollection", 
            symbol          : 10000, 
            totalSupply     : 10000, 
            mintPrice       : 0,
            contract        : '0x123abcd'
        };
 
       // let value = await DATA.getOne( this.table, query );

        return Promise.resolve( result );
    };

 
    /*=============== 


    SET  
    
    {
        name, 
        symbol, 
        totalSupply, 
        mintPrice,
        totalMinted,
        contract - contract address in blockchain
    }

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
        let removed = await DATA.remove( this.table, query );
 
        return Promise.resolve( removed );
    };
 
};

export default NFT_COLLECTION;