
import CRYPT from '../../../UTIL/CRYPT';
import EMAIL from '../EMAIL';
import USERNAME from "../USERNAME";

import WALLET from '../WALLET';
import USERNAME_PROXY from '../USERNAME_PROXY';
import LOG, { log } from '../../../UTIL/LOG';
import Twitter from './Twitter';
import Snapchat from './Snapchat';
import Discord from './Discord';
import Google from './Google';
import EXPRESS from '../../EXPRESS/EXPRESS';
import CONFIG, { authLinks, authLogin, authRegister, authTokenize, authVerify, emailVerify } from '../../CONFIG/CONFIG';

import AVATAR from '../TRIBE/AVATAR';

class AUTH {
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


    public static async get(vars: any): Promise<any> {

        var item: any = await USERNAME.get({ username: vars.username });

        if (!item.isVerified) return Promise.reject(LOG.msg('Email is not verified...'));

        let isMatch: boolean = await CRYPT.match(vars.password, item.password);

        if (!isMatch) return Promise.reject(LOG.msg('Incorrect password...'));

        return this.getLogin(item._id);
    };

    private static async getLogin(uID: any): Promise<any> {

        let user = await USERNAME.changeLastLogin(uID);
        let avatar = await AVATAR.getOne({ uid: uID, isMain: true });

        return Promise.resolve(avatar);
    };

    /*=============== 


    GET PROXY

    twitter     : username, account id
    google      : display name, email
    facebook    : name, email
    discord     : username, email
    metamask    : wallet address
    guest       : guestID
    
    type

    ================*/

    public static async getProxy(vars: any): Promise<any> {
        var uID: any;

        if (vars.email) uID = await EMAIL.getUID(vars.email);
        if (vars.wallet) uID = await WALLET.getUID(vars.wallet);

        let user = await (!uID ? USERNAME.set({}) : USERNAME.get({ where: { _id: uID } }));
        uID = vars.uID = user.uID;

        await USERNAME_PROXY.getSet(vars);

        return this.getLogin(uID);
    };

    public static async addProxy(uID: any, vars: any): Promise<any> {
        var proxyUser = await AUTH.getProxy(vars);

        if (uID != proxyUser.uID) USERNAME.reparent(uID, proxyUser.uID);

        return Promise.resolve();
    };

    public static async verify(value: string, token: string): Promise<boolean> {
        let secret: string = <string>process.env.EXPRESS_SECRET;
        let input: string = `${value}|${secret}`;

        return CRYPT.match(input, token);
    }

    public static async tokenize(value: string): Promise<string> {
        let secret: string = <string>process.env.EXPRESS_SECRET;
        let input: string = `${value}|${secret}`;

        return CRYPT.hash(input);
    }

    /*===============


    STRICT TYPE - IGNORE


    ================*/

    //#region "STRICT TYPE - IGNORE"

    public static async set2(vars: Partial<USERNAME.TYPE>): Promise<USERNAME.DOCUMENT> {
        let encryptedPassword = await CRYPT.hash(vars.password!);
        try {
            let item = await USERNAME.set2(
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

    public static async get2(vars: Partial<USERNAME.TYPE>): Promise<any> {

        var item = await USERNAME.get2({ username: vars.username });

        if (!item) return Promise.reject(LOG.msg('user does not exists...'));

        if (!item.isVerified) return Promise.reject(LOG.msg('user is not verified...'));

        let isMatch: boolean = await CRYPT.match(vars.password!, item.password!);

        if (!isMatch) return Promise.reject(LOG.msg('Incorrect password...'));

        return this.getLogin2(item._id);
    };

    private static async getLogin2(uID: any): Promise<any> {

        let user = await USERNAME.changeLastLogin2(uID);

        let avatar = await AVATAR.getOne({ uid: uID, isMain: true });

        return Promise.resolve(user);
    };

    //#endregion "STRICT TYPE - IGNORE"

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