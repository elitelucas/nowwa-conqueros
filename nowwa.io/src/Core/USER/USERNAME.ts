import DATA from "../DATA/DATA";

class USERNAME
{

    /*=============== 


    SET  
    

    ================*/
  
    public static async set( vars:any  ) : Promise<any>
    {
        let item  : any = await DATA.set( "usernames", vars );

        return Promise.resolve( item );
    }; 

    /*=============== 


    GET  
    

    ================*/
  
    public static async get( vars:any  ) : Promise<any>
    {
        let results = await DATA.get( "usernames", USERNAME.getQuery( vars ) ); 

        let item  : any = results[0];
 
        if( !item ) return Promise.reject( new Error( 'user does not exists...' ) );
 
        return Promise.resolve( item );
    }; 

    /*=============== 


    QUERY  
    

    ================*/

    private static getQuery( vars:any )
    {
        var query : any = { where:{} };
        var where : any = {};
        
        query.where = where;

        if( vars.userName )  where.userName = vars.userName;

        return query;
    }
};

export default USERNAME;