import EMAIL from "./EMAIL";
import USERNAME from "./USERNAME";
import DATA from "../DATA/DATA";
import ARRAY from '../../UTIL/ARRAY';
 
class USERNAME_CONTACTS
{
    private static table : string = "username_contacts";

    public static async set( usernameID:any, emails:[] ) : Promise<any>
    {
        let friendID : any;

        for( var n in emails )
        {
            var email = emails[n];

            friendID = await EMAIL.getUsernameID( email );

            if( !friendID )
            {
                var friend  = await USERNAME.set( {} );
                friendID    = friend._id;

                await EMAIL.set(
                {
                    email       : email,
                    usernameID  : friendID
                });
            }
            
            var contact = await DATA.get( USERNAME_CONTACTS.table, { where:{ usernameIDs: { $all: [usernameID, friendID] } } } );
            if( !contact || contact.length < 1 ) await DATA.set( USERNAME_CONTACTS.table, { usernameID:[usernameID, friendID] } );
        }
    };

    public static async get( usernameID:any ) : Promise<any>
    {
        var output      : any = [];
        var contacts    : any = await DATA.get( USERNAME_CONTACTS.table, { where:{ usernameID:[ usernameID ] }} );

        for( var n in contacts )
        {
            var array = contacts[n].usernameIDs;
            for( var i in array ) 
            {
                var id = array[i];
                if( id == usernameID ) continue;
                ARRAY.pushUnique( output, id );
            }
        }

        return Promise.resolve( output );
    };

    public static async reparent( newUID:any, oldUID:any ) : Promise<any>
    {
        // How to replace an element inside of an array, one by one manually?

        // would this work?
        // await DATA.change( USERNAME_CONTACTS.table, { values:{ usernameIDs:[newUID] }, where:{ usernameIDs:oldUID } } );
        // return Promise.resolve();

        // if not 

        var contacts    : any = await DATA.get( USERNAME_CONTACTS.table, { where:{ usernameID:[ oldUID ] }} );

        for( var n in contacts )
        {
            var array = contacts[n].usernameIDs;

            ARRAY.removeItem( array, oldUID );
            ARRAY.pushUnique( array, newUID );
 
            await DATA.change( USERNAME_CONTACTS.table, { values:{ usernameIDs:array }, where:{ _id:contacts[n]._id } } );
        }
 
        return Promise.resolve();
    }
}

export default USERNAME_CONTACTS;