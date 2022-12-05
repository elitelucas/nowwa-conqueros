
import CRYPT from '../../../UTIL/CRYPT';
import EMAIL from '../EMAIL';
import USERNAME from "../USERNAME";

import WALLET from '../WALLET';
import USERNAME_PROXY from '../USERNAME_PROXY';

import AVATAR from '../TRIBE/AVATAR';
import mongoose from 'mongoose';

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

    public static async set(vars: any): Promise<any> {

        let encryptedPassword = await CRYPT.hash(vars.password);

        try {
            let item = await USERNAME.set(
                {
                    username: vars.username,
                    password: encryptedPassword,
                    admin: false,
                    isVerified: vars.isVerified || false
                });
            return Promise.resolve(item);
        } catch (error) {
            return Promise.reject(error);
        }
    };



    /*=============== 


    GET / LOGIN
    

    ================*/


    public static async get( vars: any ): Promise<any> 
    {
        if( vars.type !="USERNAME" ) return this.getProxy( vars );

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
        let token       = await CRYPT.tokenize( username );
 
        await USERNAME.changeLastLogin( usernameID, token );
        
        let avatar      = await AVATAR.getOne({ usernameID:new mongoose.Types.ObjectId( usernameID ), isMain: true });

        return Promise.resolve(
        {
            //...avatar._doc,
            avatarID        : avatar._id,
            firstName       : avatar.firstName,
            admin           : false,
            token           : token,
            friend_count    : 0
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

    ================*/

    public static async getProxy( vars : any ) : Promise<any> 
    {
        var usernameID : any;
        let type = vars.type;

        /*
            username (id, can be email, wallet, number id),
            firstName ( persons name),
            email (if exists),
            wallet (if exists),
            type ( source, where's this from)
        */

        if( vars.token ) usernameID = await USERNAME.getUsernameID({ token:vars.token });
 
        if( !usernameID )
        {
            if( !usernameID && vars.email )    usernameID = await EMAIL.getUsernameID( vars.email );
            if( !usernameID && vars.wallet )   usernameID = await WALLET.getUsernameID( vars.wallet );
        }
 
        let user        = await ( !usernameID ? USERNAME.set({ username:vars.username }) : USERNAME.get({ where: { _id: usernameID } }));
        usernameID      = vars.usernameID = user.usernameID;

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


namespace AUTH {
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