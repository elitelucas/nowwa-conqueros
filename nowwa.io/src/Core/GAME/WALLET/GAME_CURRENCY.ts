import DATA from "../../DATA/DATA";

class GAME_CURRENCY
{
    private static table : string = "game_currencies";

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

        if( !value ) value = await DATA.set( this.table, { gameID:query.gameID, name:query.name, value:0, avatarID:query.avatarID } );
 
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
        let entry = await this.get( { _id:query._id } );

        entry.value += query.increase;

        let value = await DATA.change( this.table, { where:{ _id:query._id }, values:{ value:entry.value } } );

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
}

export default GAME_CURRENCY;