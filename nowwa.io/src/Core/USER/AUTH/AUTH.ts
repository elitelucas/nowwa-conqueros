
import CRYPT from '../../../UTIL/CRYPT';
import STRING from '../../../UTIL/STRING';
import EMAIL from '../EMAIL';
import USERNAME from "../USERNAME";
import PASSPORT from './PASSPORT';
import PROMISE, { resolve, reject } from '../../../UTIL/PROMISE';
import WALLET from '../WALLET';
import USERNAME_PROXY from '../USERNAME_PROXY';

class AUTH
{

    /*=============== 


    INIT
    

    ================*/

    public static async init() : Promise<void> 
    {
 
        PASSPORT.init();

        // Init other protocols too (metamask, twitter, etc?)

        return resolve();
    }
 
    /*=============== 


    SET / REGISTER


    ================*/

    public static async set( vars:any ) : Promise<any>
    {
        let userExists : boolean = false;

        await USERNAME.get( vars ).then( function(){ userExists=true } );

        if( userExists ) return reject( "Username already taken" );
 
        let encryptedPassword = await CRYPT.hash( vars.password );

        let item = await USERNAME.set(
        {
            username    : vars.username,
            password    : encryptedPassword,
            admin       : false,
            isVerified  : vars.isVerified || false
        });
 
        return resolve( item );
    };

 

    /*=============== 


    GET / LOGIN
    

    ================*/

    public static async get( vars:any ) : Promise<any>
    {
        var item : any = await USERNAME.get( vars );

        if( !item ) return reject( "Auth user doesn't exist "+vars.username );

        if( !item.isVerified ) return reject( 'Email is not verified...' );
 
        let isMatch : boolean = await CRYPT.match( vars.password, item.password );

        if( !isMatch ) return reject( 'Incorrect password...' );

        USERNAME.changeLastLogin( item._id );
 
        return resolve( item );
    };

    /*=============== 


    GET SOCIAL

    twitter     : username, account id, email
    google      : display name, email
    facebook    : name, email
    discord     : username, email
    metamask    : wallet address
    guest       : guestID
    
    type

    ================*/

    public static async getSocial( vars:any ) : Promise<any>
    {
        var uID     : any;
 
        if( vars.email )    uID = await EMAIL.getUID( vars.email );
        if( vars.wallet )   uID = await WALLET.getUID( vars.wallet );

        let user;

        if( uID )
        {
            user = await USERNAME.get( { where:{ _id:uID } } );

        }else{

            if( !uID )
            {
                user = await USERNAME.set( {} );
                if( !user ) return reject( "Auth: Could not create user" );
                uID = user.uID;
            }
        }
 
        vars.uID = uID;

        await USERNAME_PROXY.getSet( vars );

        USERNAME.changeLastLogin( uID );

        return resolve( user );
    };
 
};


namespace AUTH 
{     
    export interface Input 
    {
        email       : string;
        password    : string;
    }

    export interface Output
    {
        id          : string;
        token       : string;
    }

    export const entityTableName: string = 'entity';

    export type entityStructure = 
    {
        email       : string,
        password    : string,
        admin       : boolean,
        verified    : boolean
    };
}


export default AUTH;