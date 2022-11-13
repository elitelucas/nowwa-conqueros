import STRING from '../../UTIL/STRING';
import DATA from "../DATA/DATA";
import USERNAME from './USERNAME';

import CONFIG, { authenticationVerifyUrl } from '../CONFIG/CONFIG';
import nodemailer, { Transport, Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import LOG, { log } from '../../UTIL/LOG';
import CRYPT from '../../UTIL/CRYPT';
class EMAIL {
    private static table: string = "username_emails";

    private static emailSender: any;
    private static transporter: any;

    public static async init() {

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

    public static async set(vars: any): Promise<any> {
        if (!STRING.validateEmail(vars.email)) return Promise.reject(LOG.msg('Email is invalid'));

        let item: any = await EMAIL.get(vars);

        if (item) return Promise.reject(LOG.msg('Email already exists'));

        item = await DATA.set(EMAIL.table, vars);

        if (!vars.isVerified) EMAIL.requestVerification(vars.email);

        return Promise.resolve(item);
    }

    public static async requestVerification(email: string) {
        let token = await CRYPT.hash(email);

        EMAIL.send(
            {
                email: email,
                subject: `[Nowwa.io] Verify your Email`,
                content: `Click <a href=${CONFIG.vars.PUBLIC_FULL_URL}${authenticationVerifyUrl}?email=${email}&token=${token}>here</a> to verify your email!`
            });
    }

    public static async send(vars: any) {
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

    public static async get(vars: any): Promise<any> {
        let query = EMAIL.getQuery(vars);
        let results;

        if (query.where.email) {
            results = await DATA.getOne(EMAIL.table, query);
            if (!results) return Promise.reject(LOG.msg('Email does not exist'));

        } else {

            results = await DATA.get(EMAIL.table, query);
            if (!results[0]) return Promise.reject(LOG.msg('Email does not exist'));
        }

        return Promise.resolve(results);
    };

    public static async getUID(email: string): Promise<any> {
        let item = await EMAIL.get({ where: { email: email } });
        if (item) return Promise.resolve(item);

        return Promise.reject(LOG.msg('Email username does not exist'));
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change(query: any): Promise<any> {
        let results = DATA.change(EMAIL.table, query);
        return Promise.resolve(results);
    }

    public static async reparent(newUID: any, oldUID: any): Promise<any> {
        let results = await DATA.reparent(EMAIL.table, newUID, oldUID);

        return Promise.resolve(results);
    }


    /*=============== 


    QUERY  
    

    ================*/

    private static getQuery(vars: any) {
        if (vars.where) return vars;

        var query: any = { where: {} };
        var where: any = {};

        query.where = where;

        if (vars.email) {
            where.email = vars.email;
            return query;
        }

        if (vars.uID) where.uID = vars.uID;
        if (vars._id) where._id = vars._id;

        return query;
    }

};


export default EMAIL;