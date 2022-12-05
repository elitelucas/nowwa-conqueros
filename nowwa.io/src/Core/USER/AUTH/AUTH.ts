
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

        return this.getLogin( user._id, user.username );
    };

    private static async getLogin( uID: any, username:any ): Promise<any> 
    {
        let token   = await CRYPT.tokenize( username );
        let user    = await USERNAME.changeLastLogin( uID, token );
        let avatar  = await AVATAR.getOne({ uID: new mongoose.Types.ObjectId( uID ), isMain: true });

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
        var uID : any;
        let type = vars.type;

        /*
            have this contain

            username (id, can be email, wallet, number id),
            firstName ( persons name),
            email (if exists),
            wallet (if exists),
            type ( source, where's this from)

            GOOGLE username: email
            DISCORD username: email
            TWITTER username: userID (number)
            SNAPCHAT username: accountID (number)
            FACEBOOK username: userID
            GUEST: token
        */

        if( vars.token ) 
        {
            uID = await USERNAME.getUID( { token:vars.token } );
        }

        if( type == "GUEST" )
        {

        }
 
        if( vars.email ) uID = await EMAIL.getUID( vars.email );
        if( vars.wallet ) uID = await WALLET.getUID( vars.wallet );

        let username    = vars.username || vars.wallet || vars.email

        let user        = await ( !uID ? USERNAME.set({ username:username }) : USERNAME.get({ where: { _id: uID } }));
        uID             = vars.uID = user.uID;

        await USERNAME_PROXY.getSet(vars);

        return this.getLogin( uID , user.username );
    };

    public static async addProxy( uID: any, vars: any ): Promise<any> 
    {
        var proxyUser = await AUTH.getProxy(vars);

        if ( uID != proxyUser.uID) USERNAME.reparent(uID, proxyUser.uID);

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