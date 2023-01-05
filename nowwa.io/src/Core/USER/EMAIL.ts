import STRING from '../../UTIL/STRING';
import DATA from "../DATA/DATA";
import USERNAME from './USERNAME';

import CONFIG, { authVerify, emailVerify } from '../CONFIG/CONFIG';
import nodemailer, { Transport, Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import LOG, { log } from '../../UTIL/LOG';
import CRYPT from '../../UTIL/CRYPT';
import mongoose from 'mongoose';
import AUTH from './AUTH/AUTH';
import EXPRESS from '../EXPRESS/EXPRESS';

class EMAIL 
{
    private static table        : string = "username_emails";
    private static emailSender  : any;
    private static transporter  : any;

    /*=============== 


    INIT  
    

    ================*/

    public static async init() 
    {
        this.webhookEmailVerify();

        EMAIL.emailSender = `${CONFIG.vars.VERIFY_EMAIL_SENDER}`;

        EMAIL.transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: `${CONFIG.vars.VERIFY_EMAIL_SENDER}`,
                pass: `${CONFIG.vars.VERIFY_EMAIL_PASSWORD}`
            }
        });

        return Promise.resolve();
    };

    /*=============== 


    SET  
    

    ================*/

    public static async set(vars: any): Promise<any> 
    {
        if ( !STRING.validateEmail(vars.email) ) 
        {
            LOG.msg('Email is invalid');
            return Promise.resolve();
        }

        let email;
        try {
            email = await DATA.getOne(EMAIL.table, vars);
        } catch (error) {
            // if email does not exists, then proceed
        }

        if (email)  {
            LOG.msg('Email already exists');
            return Promise.resolve();
        }

        email = await DATA.set(EMAIL.table, vars);

        if (!vars.isVerified) EMAIL.requestVerification(vars.email);

        return Promise.resolve(email);
    }

 
    public static webhookEmailVerify() 
    {
        EXPRESS.app.use(`${emailVerify}`, async (req, res) => {

            const { email, token } = req.query;
            let isMatch: boolean = await CRYPT.verify(<string>email, <string>token);

            if (isMatch) {
                await this.change({
                    where: {
                        email: email
                    },
                    values: {
                        isVerified: true
                    }
                });

                await USERNAME.change({
                    where: {
                        username: email
                    },
                    values: {
                        isVerified: true
                    }
                });
                res.status(200).redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?info=verified`);
            } else {
                let message: string = 'failed to verify email';
                res.status(200).redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?error=${message}`);
            }
        });
    }

    public static async requestVerification(email: string) 
    {
        let token = await CRYPT.hashedToken(email);

        // console.log(`[Testing] : [EMAIL]: currently not sending any email when registering`);
        // return;

        EMAIL.send(
            {
                email: email,
                subject: `[Nowwa.io] Verify your Email`,
                content: `Click <a href=${CONFIG.vars.PUBLIC_FULL_URL}${emailVerify}?email=${email}&token=${token}>here</a> to verify your email!`
            });
    }

    public static async send(vars: { email:string, subject: string, html?:string, content?:string }) 
    {
        let mailOptions: MailOptions =
        {
            from: EMAIL.emailSender,
            to: vars.email,
            subject: vars.subject,
            html: vars.html || "<html><body>" + vars.content + "<body><html>"
        };

        try {
            EMAIL.transporter.sendMail(mailOptions, (error: any, info: any) => {
                if (error) return Promise.reject(LOG.msg(error));

                log('Email sent: ' + info.response);
                return Promise.resolve(info);
            });

        } catch (error) {
            log("EMAIL SEND FAILED", error);
        }

    };

    /*=============== 


    GET  
    

    ================*/


    public static async get( vars: any ): Promise<any> 
    {
        let results = await DATA.getOne( EMAIL.table, vars );

        if (!results) return Promise.reject( LOG.msg('Email does not exist') );

        return Promise.resolve(results);
    };
 
    public static async getUsernameID( vars: any ): Promise<any> 
    {
        let item: any = await DATA.getOne( EMAIL.table, vars );

        if( item ) return Promise.resolve(item.usernameID);

        return Promise.resolve(null);
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change(query: any): Promise<any> 
    {
        let results = DATA.change(EMAIL.table, query);
        return Promise.resolve(results);
    }

    public static async reparent(newUID: any, oldUID: any): Promise<any> 
    {
        let results = await DATA.reparent(EMAIL.table, newUID, oldUID);

        return Promise.resolve(results);
    }

 
   
};


namespace EMAIL {
    export type TYPE = {
        email       : string,
        isVerified  : boolean,
        usernameID         : mongoose.Types.ObjectId
    };
    export type DOCUMENT = (mongoose.Document<any, any, any> & Partial<TYPE>) | null;
}

export default EMAIL;