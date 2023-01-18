import STRING from '../../UTIL/STRING';
import DATA from "../DATA/DATA";
import USERNAME from './USERNAME';

import CONFIG, { authVerify, emailSubscribe, emailVerify } from '../CONFIG/CONFIG';
import nodemailer, { Transport, Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import LOG, { log } from '../../UTIL/LOG';
import CRYPT from '../../UTIL/CRYPT';
import mongoose from 'mongoose';
import AUTH from './AUTH/AUTH';
import EXPRESS from '../EXPRESS/EXPRESS';
import Mail from 'nodemailer/lib/mailer';
import path from 'path';

class EMAIL 
{
    private static table        : string = "username_emails";
    private static tableSubscriber        : string = "subscribers";
    private static emailSender  : any;
    private static transporter  : any;

    /*=============== 


    INIT  
    

    ================*/

    public static async init() 
    {
        this.webhookEmailVerify();
        this.webhookEmailSubscribe();

        EMAIL.emailSender = `${CONFIG.vars.VERIFY_EMAIL_SENDER}`;

        EMAIL.transporter = nodemailer.createTransport(
        {
            // service: 'zoho',
            host: 'smtp.zoho.eu',
            secure: true,
            port: 465,
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

        let email = await DATA.getOne( EMAIL.table, vars);
 
        if ( email )  
        {
            LOG.msg('Email already exists');

            if( vars.usernameID && !email.usernameID ) this.change( { where:{ _id:email._id }, values:{ usernameID:vars.usernameID }}  );

            return Promise.resolve();
        }

        email = await DATA.set( EMAIL.table, vars);

        if ( !vars.isVerified ) EMAIL.requestVerification( vars.email );

        return Promise.resolve(email);
    }

    public static async setSubscriber(vars: any): Promise<any> 
    {
        if ( !STRING.validateEmail(vars.email) ) 
        {
            LOG.msg('Email is invalid');
            return Promise.resolve();
        }

        let email = await DATA.getOne( EMAIL.tableSubscriber, vars);
 
        if ( email )  
        {
            LOG.msg('Subscriber already exists');

            return Promise.resolve(null);
        }

        email = await DATA.set( EMAIL.tableSubscriber, vars);

        return Promise.resolve(email);
    }
 
    public static webhookEmailSubscribe() 
    {
        console.log('setup email subscribe');
        EXPRESS.app.use(`${emailSubscribe}`, async (req, res) => {

            console.log('about to subscribe: ');

            const { email } = req.query;

            console.log(`email`, email);

            let prevEmail = await this.setSubscriber({
                email: email
            });

            if (prevEmail != null) {

                let html:string = `Your email is confirmed.<br/>We'll notify you when Super Snappy is soft launched.<br/><br/><img src="cid:badge" />`
                let result = await EMAIL.send({
                    email: <string>email,
                    subject: 'Subscribe to SuperSnappy.io',
                    html: html,
                    attachments: [{
                    filename: "SUPERSNAPPY_LOGO_email.png",
                    path: path.resolve("storage", "SUPERSNAPPY_LOGO_email.png"),
                    cid: 'badge' //same cid value as in the html img src,
                    }]
                });

                res.status(200).send(`Success: ${result}`);
            } else {
                res.status(200).send(`Success: false, already registered`);
            }

        });
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

    public static async send(vars: { email:string, subject: string, html?:string, content?:string, attachments?: Mail.Attachment[] }) 
    {
        return new Promise((resolve, reject) => {

            let mailOptions: MailOptions =
            {
                from: EMAIL.emailSender,
                to: vars.email,
                subject: vars.subject,
                html: vars.html || "<html><body>" + vars.content + "<body><html>",
                attachments: vars.attachments
            };
    
            console.log(`about to send email to: ${vars.email}`);
    
            try {
                EMAIL.transporter.sendMail(mailOptions, (error: any, info: any) => {
                    
                    if (error) {
                        console.log("EMAIL SEND FAILED", error);
                        resolve(false);
                    } else {
                        console.log('EMAIL SEND SUCCESS', info.response);
                        resolve(true);
                    }
    
                });
    
            } catch (error) {
                console.log("EMAIL SEND ERROR", error);
                resolve(false);
            }
        });

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
        let results = DATA.change( EMAIL.table, query );
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