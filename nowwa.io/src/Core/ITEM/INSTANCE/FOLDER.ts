class FOLDER
{
    private static table: string = "folders";

    /*=============== 


    GET  
    

    ================*/

    public static async get( query: any ) : Promise<any>
    {

    };

    /*=============== 


    SET  
    

    ================*/

    public static async set( query: any ) : Promise<any>
    {

    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query: any ) : Promise<any>
    {

    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query: any ) : Promise<any>
    {

    };

    /*=============== 


    QUERY  
    

    ================*/

    private static getQuery( vars:any )
    {
        if( vars.where ) return vars;

        var query   : any = { where:{}, values:{} };
        var where   : any = {};

        query.where = where;

        if( vars.uID ) where.uID = vars.uID;

        return query;
    }
};