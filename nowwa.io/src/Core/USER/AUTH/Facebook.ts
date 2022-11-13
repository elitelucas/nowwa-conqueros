import CONFIG, { googleAuthUrl, googleCallbackUrl } from '../../CONFIG/CONFIG';
import fetch, { RequestInit } from 'node-fetch';
import EXPRESS from '../../EXPRESS/EXPRESS';
import { google } from 'googleapis';
import Authentication from '../../DEPRECATED/Authentication';

class Facebook {
    private static Instance: Facebook;

    /**
     * Initialize email module.
     */
    public static async init(): Promise<void> {
        Facebook.Instance = new Facebook();
        Facebook.WebhookAuthLink();
        Facebook.WebhookCallbackLink();
        return Promise.resolve();
    }

    public static async WebhookAuthLink(): Promise<void> {
        EXPRESS.app.use(`${googleAuthUrl}`, (req, res) => {

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

            res.status(200).send({
                success: true,
                link: googleUrl
            });
        });
    }

    public static async WebhookCallbackLink(): Promise<void> {
        EXPRESS.app.use(`${googleCallbackUrl}`, async (req, res) => {
            // console.log('query callback');
            // console.log(JSON.stringify(req.query));
            // console.log('session callback');
            // console.log(JSON.stringify(req.session));

            try {

                let googleClient = new google.auth.OAuth2({
                    clientId: CONFIG.vars.GOOGLE_CLIENT_ID,
                    clientSecret: CONFIG.vars.GOOGLE_CLIENT_SECRET,
                    redirectUri: CONFIG.vars.GOOGLE_CALLBACK_URL,
                });

                const { code } = req.query;

                let accessToken = await googleClient.getToken(code as string).then((tokenResponse) => {
                    return Promise.resolve(tokenResponse.res!.data.access_token);
                });
                googleClient.setCredentials({
                    access_token: accessToken
                });
                google.options({
                    auth: googleClient
                });
                let userInfo = await google.oauth2('v2').userinfo.get();
                console.log(`user: ${userInfo.data.email}`);
                let contactInfo = await google.people('v1').people.connections.list({
                    resourceName: 'people/me',
                    personFields: 'names,emailAddresses'
                });
                let token = await Authentication.Hash(userInfo.data.email!);
                res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?info=loggedin&name=${userInfo.data.name!}&token=${token}&admin=false&id=${userInfo.data.email!}&friend_count=${contactInfo.data.totalPeople}`);
            } catch (error: any) {
                res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?error=${error.message}`);
            }
        });
    }
}

export default Facebook;