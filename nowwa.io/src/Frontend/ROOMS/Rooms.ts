import CONQUER from "../CONQUER";
import RoomInstance from "./RoomInstance/RoomInstance";
import LOG, { log } from "../../UTIL/LOG";

class Rooms
{
    private conquer:CONQUER;
    public pool : any = {};

    public constructor( instance:CONQUER ) 
    {
        this.conquer = instance;
    }
 
    /*=============== 
 
    GET (JOIN)
    {
        avatarIDs?:[ avatarID ]
    }

    [ avatarID1, avatarID2, etc ]
 
    ================*/

    public async get( vars:any ) : Promise<any>
    {
        let values : any = await this.conquer.do( "ROOM.get", vars );

        for( var n in values )
        {
            let room = new RoomInstance( this.conquer, values[n] );
            this.pool[ room.roomID ] = room;
        }
 
        return Promise.resolve( this.pool );
    };

    public async getOne( vars:any ) : Promise<any>
    {
        if( Array.isArray( vars ) )     vars = { avatarIDs:vars };
        if( typeof vars == 'string' )   vars = { roomID:vars };

        let value   = await this.conquer.do( "ROOM.getOne", vars );

        let room    = new RoomInstance( this.conquer, value );

        this.pool[ room.roomID ] = room;

        return Promise.resolve( room );
    };
 
    /*=============== 


    LEAVE
    

    ================*/

    public async leave( room:RoomInstance ) : Promise<any>
    {
        delete this.pool[ room.roomID ];

        return Promise.resolve();
    };

    /*=============== 


    ON MESSAGE
    

    ================*/

    public _onServerMessage( object:any )
    {
        for( let n in object.messages )
        {
            let message = object.messages[n];

            if( message.avatarID == this.conquer.User.avatarID ) continue;

            let room  = this.pool[ message.roomID ];
            if( room ) room._onServerMessage( message );
        }
 
    }
}

export default Rooms;