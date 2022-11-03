
import CRYPT from '../../../UTIL/CRYPT';
import STRING from '../../../UTIL/STRING';
import EMAIL from '../EMAIL';
import USERNAME from "../USERNAME";
import PASSPORT from './PASSPORT';
class AUTH
{

    /*=============== 


    INIT
    

    ================*/

    public static async init() : Promise<void> 
    {
 
        PASSPORT.init();

        // Init other protocols too (metamask, twitter, etc?)

        return Promise.resolve();
    }
 
    /*=============== 


    SET / REGISTER


    ================*/

    public static async set( vars:any ) : Promise<any>
    {
        let userExists : boolean = false;

        await USERNAME.get( vars ).then( function(){ userExists=true } );

        if( userExists ) return Promise.reject( new Error( "Username already taken" ) );
 
        let encryptedPassword = await CRYPT.hash( vars.password );

        let item = await USERNAME.set(
        {
            userName    : vars.userName,
            password    : encryptedPassword,
            admin       : false,
            isVerified  : vars.isVerified || false
        });

        EMAIL.set( vars.userName, item.id );
 
        return Promise.resolve( item );
    };

 

    /*=============== 


    GET / LOGIN
    

    ================*/

    public static async get( vars:any ) : Promise<any>
    {
        USERNAME.get( vars ).then( onSuccess ).catch( noUserName );

        async function onSuccess( item:any )
        {
            let isMatch : boolean = await CRYPT.match( vars.password, item.password );

            if( !isMatch ) return onError( 'incorrect password...' );
            if( !item.isVerified ) return onError( 'email not verified...' );

            return Promise.resolve( item );
        }

        function noUserName()
        {
            return onError( "Auth user doesn't exist "+vars.userName );
        }

        function onError( e:any )
        {
            return Promise.reject( new Error( e ) );
        }
    };

    /*=============== 


    GET SET / SOCIAL LOGIN

    
    twitter: username, account id, email
    google: display name, email
    facebook: name, email
    discord: username, email
    metamask: wallet address

    ================*/

    public static async getSet( vars:any ) : Promise<any>
    {
        USERNAME.get( vars ).then( onSuccess ).catch( noUserName );

        async function onSuccess( item:any )
        {
            let isMatch : boolean = await CRYPT.match( vars.password, item.password );

            if( !isMatch ) return onError( 'incorrect password...' );
            if( !item.isVerified ) return onError( 'email not verified...' );

            return Promise.resolve( item );
        }

        function noUserName()
        {
            return onError( "Auth user doesn't exist "+vars.userName );
        }

        function onError( e:any )
        {
            return Promise.reject( new Error( e ) );
        }
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