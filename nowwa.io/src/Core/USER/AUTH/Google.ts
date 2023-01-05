import CONFIG, { googleAuthUrl, googleCallbackUrl } from '../../CONFIG/CONFIG';
import fetch, { RequestInit } from 'node-fetch';
import EXPRESS from '../../EXPRESS/EXPRESS';
import { google, people_v1 } from 'googleapis';
import AUTH from './AUTH';
import CRYPT from '../../../UTIL/CRYPT';
import Storage from '../../../Frontend/UTILS/Storage';
import AVATAR from '../TRIBE/AVATAR';
import mongoose from 'mongoose';
import USERNAME_PROXY from '../USERNAME_PROXY';
import EMAIL from '../EMAIL';
import { type } from 'os';

class Google 
{
    private static Instance: Google;

    /**
     * Initialize email module.
     */
    public static async init(): Promise<void> 
    {
        Google.Instance = new Google();
        Google.WebhookCallbackLink();
        return Promise.resolve();
    }

    public static get AuthLink(): string 
    {
        let googleScope: string[] = [
            'https://www.googleapis.com/auth/contacts.readonly',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ]

        let googleClient = new google.auth.OAuth2({
            clientId: CONFIG.vars.GOOGLE_CLIENT_ID,
            clientSecret: CONFIG.vars.GOOGLE_CLIENT_SECRET,
            redirectUri: CONFIG.vars.GOOGLE_CALLBACK_URL,
        });

        let googleUrl: string = googleClient.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'online',

            // If you only need one scope you can pass it as a string
            scope: googleScope
        });

        return googleUrl;
    }

    public static async WebhookCallbackLink(): Promise<void> 
    {
        EXPRESS.app.use(`${googleCallbackUrl}`, async (req, res) => 
        {
            // console.log('query callback');
            // console.log(JSON.stringify(req.query));
            // console.log('session callback');
            // console.log(JSON.stringify(req.session));

            try {

                let googleClient = new google.auth.OAuth2(
                {
                    clientId        : CONFIG.vars.GOOGLE_CLIENT_ID,
                    clientSecret    : CONFIG.vars.GOOGLE_CLIENT_SECRET,
                    redirectUri     : CONFIG.vars.GOOGLE_CALLBACK_URL,
                });

                const { code } = req.query;

                let accessToken = await googleClient.getToken(code as string).then((tokenResponse:any) => {
                    return Promise.resolve(tokenResponse.res!.data.access_token);
                });
                googleClient.setCredentials({
                    access_token: accessToken
                });
                google.options({
                    auth: googleClient
                });

                console.log(`[Google] here 1`);

                let userInfo = await google.oauth2('v2').userinfo.get();
                console.log(`user: ${userInfo.data.email}`);
                let contactInfo = await google.people('v1').people.connections.list({
                    resourceName: 'people/me',
                    personFields: 'names,emailAddresses'
                });

                let friend_count    = contactInfo.data.totalPeople || 0;
                let friend_emails:string[] = [];

                console.log(`[Google] here 2`);

                if (typeof contactInfo.data.connections != 'undefined') {
                    contactInfo.data.connections.forEach(element => {
                        if (typeof element.emailAddresses != 'undefined') {
                            element.emailAddresses.forEach(email => {
                                if (typeof email != 'undefined') {
                                    friend_emails.push(email.value!);
                                }
                            });
                        }
                    });
                }

                console.log(`[Google] here 3 friend_emails.length`, friend_emails.length);

                let account:{[key:string]:any} = 
                {
                    username        : userInfo.data.email!,
                    firstName       : userInfo.data.name!,
                    email           : userInfo.data.email!,
                    friendEmails    : friend_emails,
                    type            : 'GOOGLE'
                };
                
                console.log(`[Google] here 4`);

                let user = await AUTH.get(account);
                
                console.log(`[Google] here 5`);

                let searchParams:string = Object.keys(user).map(key => key + '=' + user[key]).join('&');
                res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?${searchParams}`);
            } catch (error: any) {
                res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?error=${error.message}`);
            }
        });
    } 

    public static async Share(vars: {shareMessage:string, shareUrl:string, email:string }): Promise<void> {

        await EMAIL.send({
            email: vars.email,
            subject: 'Share from Google',
            content: vars.shareMessage + ' ' + vars.shareUrl
        });
        
        return Promise.resolve();
    }

    public static async ShareGet (vars: {avatarID:string }): Promise<void> {

        let avatar = await AVATAR.getOne({ _id: new mongoose.Types.ObjectId ( vars.avatarID ) });

        let proxy = await USERNAME_PROXY.get({ where: { usernameID: new mongoose.Types.ObjectId ( avatar.usernameID ) }});

        let friendEmails = proxy.friendEmails;
        
        return Promise.resolve(friendEmails);
    }
}

export default Google;