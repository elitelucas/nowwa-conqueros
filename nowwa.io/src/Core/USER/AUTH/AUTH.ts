
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
import CONFIG, { authLinks, authLogin, authRegister, authTokenize, authVerify, emailVerify } from '../../CONFIG/CONFIG';

import dotenv from 'dotenv';

dotenv.config();

class AUTH {

    /*=============== 


    INIT
    

    ================*/

    public static async init(): Promise<void> 
    {
        PASSPORT.init();

        this.webhookAuthLinks();
        this.webhookAuthVerify();
        this.webhookAuthRegister();
        this.webhookAuthLogin();
        this.webhookAuthTokenize();

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

    public static async set(vars: any): Promise<any> 
    {
        let encryptedPassword = await CRYPT.hash(vars.password);

        try {
            let item = await USERNAME.set(
                {
                    username    : vars.username,
                    password    : encryptedPassword,
                    admin       : false,
                    isVerified  : vars.isVerified || false
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

        var item: any = await USERNAME.get(vars);

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

    public static async getProxy(vars: any): Promise<any> 
    {
        var uID: any;

        if (vars.email) uID = await EMAIL.getUID(vars.email);
        if (vars.wallet) uID = await WALLET.getUID(vars.wallet);

        let user;

        if (!uID) 
        {
            user = await USERNAME.set({});
        } else {
            user = await USERNAME.get({ where: { _id: uID } });
        }

        vars.uID = user.uID;

        await USERNAME_PROXY.getSet(vars);

        USERNAME.changeLastLogin(uID);

        return Promise.resolve(user);
    };

    public static async addProxy(uID: any, vars: any): Promise<any> 
    {
        var proxyUser = await AUTH.getProxy(vars);

        if (uID != proxyUser.uID) USERNAME.reparent(uID, proxyUser.uID);

        return Promise.resolve();
    };

    public static webhookAuthLinks() 
    {
        EXPRESS.app.use(`${authLinks}`, (req, res) => 
        {
            res.status(200).send({
                success: true,
                discord: Discord.AuthLink,
                snapchat: Snapchat.AuthLink,
                google: Google.AuthLink,
                twitter: Twitter.AuthLink
            });
        });
    }

    public static webhookAuthVerify() 
    {
        EXPRESS.app.use(`${authVerify}`, async (req, res) => 
        {
            let id: string = <string>req.body.id;
            let token: string = <string>req.body.token;
            let isMatch: boolean = await this.verify(id, token);
            res.status(200).send({
                success: true,
                valid: isMatch
            });
        });
    }

    public static webhookAuthRegister() 
    {
        EXPRESS.app.use(`${authRegister}`, async (req, res) => 
        {
            let email: string = req.body.email;
            let password: string = req.body.password;
            let err;
            try {
                await this.set({
                    username: email,
                    password: password
                });
            } catch (error) {
                err = error;
            }
            if (err) {
                res.send({
                    success: false,
                    error: (<Error>err).message
                });
            } else {
                res.send({
                    success: true
                });
            }
        });
    }

    public static webhookAuthLogin() 
    {
        EXPRESS.app.use(`${authLogin}`, async (req, res) => {
            let email: string = req.body.email;
            let password: string = req.body.password;
            let user, err;
            try {
                user = await this.get({
                    username: email,
                    password: password
                });
                if (!user.isVerified) {
                    return Promise.reject(LOG.msg('email is not verified!'));
                }
            } catch (error) {
                err = error;
            }
            if (err) {
                res.send({
                    success: false,
                    error: (<Error>err).message
                });
            } else {
                let token: string = await this.tokenize(user.username);
                res.send({
                    success: true,
                    account: {
                        id: user.username,
                        name: user.username,
                        token: token,
                        admin: user.admin,
                        friend_count: 0
                    }
                });
            }
        });
    }

    public static webhookAuthTokenize() 
    {
        EXPRESS.app.use(`${authTokenize}`, async (req, res) => 
        {
            let input: string = <string>req.body.input;
            let token: string = await this.tokenize(input);
            res.status(200).send({
                success: true,
                value: token
            });
        });
    }

    public static async verify(value: string, token: string): Promise<boolean> 
    {
        let secret: string = <string>process.env.EXPRESS_SECRET;
        let input: string = `${value}|${secret}`;
        return CRYPT.match(input, token);
    }

    public static async tokenize(value: string): Promise<string> 
    {
        let secret: string = <string>process.env.EXPRESS_SECRET;
        let input: string = `${value}|${secret}`;
        return CRYPT.hash(input);
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