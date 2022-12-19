import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import ARRAY from "../../../UTIL/ARRAY";
import QUERY from "../../../UTIL/QUERY";
import DATE from "../../../UTIL/DATE";
import GAME_CURRENCY from "../WALLET/GAME_CURRENCY";

class DAILYREWARDS
{
    private static table : string = "game_dailyrewards";

    /*=============== 


    GET  
    
    {
        gameID,
        avatarID
    }    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        let obj         = await this.getSet( query );
        let timePassed  = DATE.hoursFrom( obj.rewardDate );

        if( timePassed < 16 ) return Promise.resolve( null );

        let current     = obj.current;
        let data        = obj.data;

        if( timePassed > 36 || current >= data.length ) current = 0; 

        for( let n=0; n< data.length; n++ )
        {
            let item = data[n];
            if( n < current ) item.state = "Collected";
            if( n > current ) item.state = "Pending";
            if( n == current ) item.state = "Ready";
        }
  
        return Promise.resolve( obj );
    };

    private static async getSet( query:any ) : Promise<any>
    {
        let obj         = await DATA.getSet( this.table, { gameID:query.gameID, avatarID:query.avatarID });

        if( obj.data ) return Promise.resolve( obj );

        obj.rewardDate  = 0;
        obj.current     = 0;
        obj.data        = [];

        for( let n =0; n<15; n++ ) obj.data.push(
        {
            id      : n,
            varName : "Coin",
            symbol  : "Coin",
            value   : (n+1) * 100,
            day     : "DAY "+ (n+1) 
        });
 
        return Promise.resolve( obj );
    }

 

    /*=============== 


    SET // Collect
    {
        gameID,
        avatarID
    }

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let obj : any       = await this.getSet( query );

        let reward          = obj.data[ obj.current ];
 
        if( !reward || DATE.hoursFrom( obj.rewardDate ) < 16 ) return Promise.resolve( null );

        await DATA.change( this.table, { where:{ _id:obj._id }, values:{ current:obj.current+1, rewardDate : DATE.now() }});
 
        if( reward.varName == "Coin" ) await GAME_CURRENCY.increase( { gameID:query.gameID, name:"Coin", avatarID:query.avatarID }, reward.value );
  
        return Promise.resolve( reward );
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

export default DAILYREWARDS;