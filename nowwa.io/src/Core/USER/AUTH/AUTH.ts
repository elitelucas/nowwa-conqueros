
import CRYPT from '../../../UTIL/CRYPT';
import EMAIL from '../EMAIL';
import USERNAME from "../USERNAME";
import PASSPORT from './PASSPORT';

import WALLET from '../WALLET';
import USERNAME_PROXY from '../USERNAME_PROXY';
import LOG, { log } from '../../../UTIL/LOG';
import Twitter from './Twitter';
import Snapchat from './Snapchat';
import Discord from './Discord';
import Google from './Google';
import EXPRESS from '../../EXPRESS/EXPRESS';
import { socialAuthLinks } from '../../CONFIG/CONFIG';

class AUTH {

    /*=============== 


    INIT
    

    ================*/

    public static async init(): Promise<void> {
        PASSPORT.init();
        this.WebhookAuthLinks();

        await Twitter.init();
        await Snapchat.init();
        await Discord.init();
        await Google.init();

        // Init other protocols too (metamask, twitter, etc?)

        return Promise.resolve();
    }

    /*=============== 


    SET / REGISTER


    ================*/

    public static async set(vars: any): Promise<any> {
        let userExists: boolean = false;

        await USERNAME.get(vars).then(function () { userExists = true });

        if (userExists) return Promise.reject(LOG.msg("Username already taken"));

        let encryptedPassword = await CRYPT.hash(vars.password);

        let item = await USERNAME.set(
            {
                username: vars.username,
                password: encryptedPassword,
                admin: false,
                isVerified: vars.isVerified || false
            });

        return Promise.resolve(item);
    };



    /*=============== 


    GET / LOGIN
    

    ================*/

    public static async get(vars: any): Promise<any> {
        var item: any = await USERNAME.get(vars);

        if (!item) return Promise.reject(LOG.msg("Auth user doesn't exist " + vars.username));

        if (!item.isVerified) return Promise.reject(LOG.msg('Email is not verified...'));

        let isMatch: boolean = await CRYPT.match(vars.password, item.password);

        if (!isMatch) return Promise.reject(LOG.msg('Incorrect password...'));

        USERNAME.changeLastLogin(item._id);

        return Promise.resolve(item);
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

        let user;

        if (!uID) {
            user = await USERNAME.set({});
        } else {
            user = await USERNAME.get({ where: { _id: uID } });
        }

        vars.uID = user.uID;

        await USERNAME_PROXY.getSet(vars);

        USERNAME.changeLastLogin(uID);

        return Promise.resolve(user);
    };

    public static async addProxy(uID: any, vars: any): Promise<any> {
        var proxyUser = await AUTH.getProxy(vars);

        if (uID != proxyUser.uID) USERNAME.reparent(uID, proxyUser.uID);

        return Promise.resolve();
    };

    public static WebhookAuthLinks() {
        EXPRESS.app.use(`${socialAuthLinks}`, (req, res) => {
            res.status(200).send({
                success: true,
                discord: Discord.AuthLink,
                snapchat: Snapchat.AuthLink,
                google: Google.AuthLink,
                twitter: Twitter.AuthLink
            });
        });
    }


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