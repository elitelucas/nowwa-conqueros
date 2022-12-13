import { ACTIONS } from "../../Models/ENUM";
import CONQUER from "../CONQUER";
import FollowerInstance from "./FollowerInstance";

class Followers
{
    private conquer : CONQUER;

    public constructor( instance:CONQUER ) 
    {
        this.conquer = instance;
    }

    public pool : any = [];

    /*=============== 


    GET
    

    ================*/

    public async get( force?:boolean ) : Promise<any>
    {
        if( this.pool.length && !force ) return Promise.resolve( this.pool );

        let array   = await this.conquer.do( ACTIONS.FOLLOWERS_GET );
        this.pool   = [];

        for( var n in array ) this.pool.push( new FollowerInstance( this.conquer, array[n] ));
 
        return Promise.resolve( this.pool );
    };

    /*=============== 


    SET
    

    ================*/

    public async set( toFollowID:any ) : Promise<any>
    {
        var friendship = await this.conquer.do( ACTIONS.FOLLOWERS_SET, { toFollowID:toFollowID } );

        return Promise.resolve( friendship );
    };
}

export default Followers;