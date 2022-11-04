import EMAIL from "./EMAIL";
import USERNAME from "./USERNAME";
import DATA from "../DATA/DATA";
import ARRAY from '../../UTIL/ARRAY';
import { resolve } from "path";

class USERNAME_CONTACTS
{
    private static table : string = "username_contacts";

    public static async set( uID:any, emails:[] ) : Promise<any>
    {
        let friendID : any;

        for( var n in emails )
        {
            var email = emails[n];

            friendID = await EMAIL.getUID( email );

            if( !friendID )
            {
                var friend  = await USERNAME.set( {} );
                friendID    = friend._id;

                EMAIL.set(
                {
                    email   : email,
                    uID     : friendID
                });
            }
            
            var contact = await DATA.get( USERNAME_CONTACTS.table, { where:{ uIDs: { $all: [uID, friendID] } } } );
            if( !contact || contact.length < 1 ) await DATA.set( USERNAME_CONTACTS.table, { uID:[uID, friendID] } );
        }
    };

    public static async get( uID:any ) : Promise<any>
    {
        var output      : any = [];
        var contacts    : any = await DATA.get( USERNAME_CONTACTS.table, { where:{ uID:[ uID ] }} );

        for( var n in contacts )
        {
            var item = contacts[n].uIDs;
            for( var i in item ) 
            {
                var id = item[i];
                if( id == uID ) continue;
                ARRAY.pushUnique( output, id );
            }
        }

        return resolve( output );
    };
}

export default USERNAME_CONTACTS;