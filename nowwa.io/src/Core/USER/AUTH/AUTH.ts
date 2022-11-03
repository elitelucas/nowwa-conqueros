import passport from "passport";
import passportLocal from 'passport-local';
import CRYPT from '../../../UTIL/CRYPT';
import USERNAME from "../USERNAME";
class AUTH
{

    /*=============== 


    INIT
    

    ================*/

    public static async init() : Promise<void> 
    {
        AUTH.initPassport();
        
        // Init other protocols too (metamask, twitter, etc?)

        return Promise.resolve();
    }

    private static initPassport()
    {
        passport.use( new passportLocal.Strategy(
        {
            passwordField: "password",
            usernameField: "email"
        }, (email, password, done) => {}));
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

        let item = USERNAME.set(
        {
            userName    : vars.userName,
            password    : encryptedPassword,
            admin       : false,
            isVerified  : vars.isVerified || false
        });
 
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