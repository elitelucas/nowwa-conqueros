import { ACTIONS } from "../../Models/ENUM";
import CONQUER from "../CONQUER";
import AvatarInstance from "./AvatarInstance";
 
class Avatars
{
    private conquer : CONQUER;
    public pool     : any = [];

    public constructor( instance:CONQUER ) 
    {
        this.conquer = instance;
    }
 
    /*=============== 


    GET
    

    ================*/

    public async get( avatarIDs?:any ) : Promise<any>
    {
        if( typeof avatarIDs == "string" )
        {
           let value = await this.conquer.do( ACTIONS.AVATAR_GETONE, { _id:avatarIDs } );
           return Promise.resolve( new AvatarInstance( this.conquer, value ) );
        }

        if( Array.isArray( avatarIDs ) )
        {
           let value = await this.conquer.do( ACTIONS.AVATAR_GET, { _id:avatarIDs } );
           return Promise.resolve( new AvatarInstance( this.conquer, value ) );
        }
 
        this.pool   = [];

        let array   = await this.conquer.do( ACTIONS.AVATAR_GET );
 
        for( var n in array ) this.pool.push( new AvatarInstance( this.conquer, array[n] ));
 
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

export default Avatars;