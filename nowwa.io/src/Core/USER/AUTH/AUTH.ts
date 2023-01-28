
import CRYPT from '../../../UTIL/CRYPT';
import EMAIL from '../EMAIL';
import USERNAME from "../USERNAME";

import WALLET from '../WALLET/WALLET';
import USERNAME_PROXY from '../USERNAME_PROXY';

import AVATAR from '../TRIBE/AVATAR';
import mongoose from 'mongoose';
import DATE from '../../../UTIL/DATE';

class AUTH 
{
    /*=============== 


    INIT
    

    ================*/

    public static async init(): Promise<void> {

        return Promise.resolve();
    }

    /*=============== 


    SET / REGISTER


    ================*/

    public static async set(vars: any): Promise<any> 
    {
        console.log(`create new user`, JSON.stringify(vars));
        let encryptedPassword = await CRYPT.hash(vars.password);

        try 
        {
            let item = await USERNAME.set(
            {
                username    : vars.username,
                password    : encryptedPassword,
                admin       : false,
                isVerified  : vars.isVerified || false
            });
            
            console.log(`create new user success`);

            return Promise.resolve(item);

        } catch (error) 
        {
            return Promise.reject(error);
        }
    };



    /*=============== 


    GET / LOGIN
    

    ================*/


    public static async get( vars: any ): Promise<any> 
    {
        
        if ( vars.token ) {
            let token:string = await CRYPT.token(vars.username);
            let isTokenMatch: boolean = await CRYPT.match( token, vars.token );
            if( !isTokenMatch ) return Promise.reject( 'Incorrect token...' );
            return Promise.resolve(vars);
        }

        if( vars.type != "USERNAME" ) return this.getProxy( vars );

        var user : any = await USERNAME.get({ username: vars.username });

        if( !user ) return Promise.reject( 'User not found' );

        if( !user.isVerified ) return Promise.reject( 'Email is not verified...' );

        let isMatch : boolean = await CRYPT.match( vars.password, user.password );
        if( !isMatch ) return Promise.reject( 'Incorrect password...' );

        return this.getLogin( user );
    };

    private static async getLogin( user:any ): Promise<any> 
    {
        let usernameID  = user._id;
        let username    = user.username;
        let token       = await CRYPT.hashedToken( username );
 
        await USERNAME.changeLastLogin( usernameID, token );
        
        let avatar      = await AVATAR.getOne({ usernameID:new mongoose.Types.ObjectId( usernameID ), isMain: true });

        return Promise.resolve(
        {
            avatarID        : avatar._id,
            firstName       : avatar.firstName,
            userPhoto       : avatar.userPhoto,
            // admin           : false,
            //username        : username,
            token           : token,
            // friend_count    : 0
        });
    };

    /*=============== 


    GET PROXY

    twitter     : username, account id
    google      : display name, email
    facebook    : name, email
    discord     : username, email
    metamask    : wallet address
    snapchat    : account id
    guest       : guestID
    type

    {
        username,
        email,
        wallet,
        firstName,
        token
    }

    ================*/

    public static async getProxy( vars : any ) : Promise<any> 
    {
        var usernameID : any;

        console.log(`[AUTH.ts] getProxy vars.username 1`, JSON.stringify(vars, null, 4));

        if (vars.type) vars.username = `${vars.username}_${vars.type}`;

        console.log(`[AUTH.ts] getProxy vars.username 2`, JSON.stringify(vars, null, 4));
 
        if( vars.token ) usernameID = await USERNAME.getUsernameID({ token:vars.token });
 
        if( !usernameID && vars.username ) usernameID = await USERNAME.getUsernameID({ username:vars.username });
        if( !usernameID && vars.username ) usernameID = await USERNAME_PROXY.getUsernameID({ username:vars.username });
        if( !usernameID && vars.email )    usernameID = await EMAIL.getUsernameID({ email:vars.email });
        if( !usernameID && vars.wallet )   usernameID = await WALLET.getUsernameID({ wallet:vars.wallet });

        if (!usernameID && !vars.type) vars.username = `${vars.username}_${DATE.now()}`;
 
        let user        = await ( usernameID ? USERNAME.get({ where: { _id: usernameID } }) : USERNAME.set(vars) );

        usernameID      = vars.usernameID = user._id;

        await USERNAME_PROXY.getSet( vars );

        return this.getLogin( user );
    };

    public static async addProxy( usernameID : any, vars: any ): Promise<any> 
    {
        var proxyUser = await AUTH.getProxy( vars );

        if ( usernameID != proxyUser.usernameID ) USERNAME.reparent(usernameID, proxyUser.usernameID);

        return Promise.resolve();
    };
 
};


namespace AUTH 
{
    export interface Input {
        email: string;
        password: string;
    }

    export interface Output {
        id: string;
        token: string;
    }

    export const entityTableName: string = 'entity';

    export type entityStructure =
        {
            email: string,
            password: string,
            admin: boolean,
            verified: boolean
        };
}


export default AUTH;