import CONQUER from "../CONQUER";
import FriendInstance from "./FriendInstance";

class Friends
{
    public pool : any = [];

    /*=============== 


    GET
    

    ================*/

    public async get( force?:boolean ) : Promise<any>
    {
        if( this.pool.length && !force ) return Promise.resolve( this.pool );

        let array   = await CONQUER.do( "FRIENDS.get" );
        this.pool   = [];

        for( var n in array ) this.pool.push( new FriendInstance( array[n] ));
 
        return Promise.resolve( this.pool );
    };

    /*=============== 


    SET
    

    ================*/

    public async set( friendID:any ) : Promise<any>
    {
        var friendship = await CONQUER.do("FRIENDS.set", { friendID:friendID } );

        return Promise.resolve( friendship );
    };
}

export default Friends;