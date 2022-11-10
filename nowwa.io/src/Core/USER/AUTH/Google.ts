import CONFIG, { googleAuthUrl, googleCallbackUrl } from '../../CONFIG/CONFIG';
import fetch, { RequestInit } from 'node-fetch';
import EXPRESS from '../../EXPRESS/EXPRESS';
import { google } from 'googleapis';
import Authentication from '../../DEPRECATED/Authentication';

class Google {
    private static Instance: Google;

    /**
     * Initialize email module.
     */
    public static async init(): Promise<void> {
        Google.Instance = new Google();
        Google.WebhookAuthLink();
        Google.WebhookCallbackLink();
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
                redirectUri: CONFIG.vars.GOOGLE_CALLBACK_URL
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
        EXPRESS.app.use(`${googleCallbackUrl}`, (req, res) => {
            console.log('query callback');
            console.log(JSON.stringify(req.query));
            console.log('session callback');
            console.log(JSON.stringify(req.session));

            let googleClient = new google.auth.OAuth2({
                clientId: CONFIG.vars.GOOGLE_CLIENT_ID,
                clientSecret: CONFIG.vars.GOOGLE_CLIENT_SECRET,
                redirectUri: CONFIG.vars.GOOGLE_CALLBACK_URL
            });

            const { access_token, code } = req.query;

            googleClient.getToken(code as string).then((tokenResponse) => {
                console.log(`tokenResponse`, JSON.stringify(tokenResponse, null, 4));
                var firstRequestInit: RequestInit = {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenResponse.res?.data.access_token}`
                    }
                };
                fetch('https://www.googleapis.com/oauth2/v2/userinfo', firstRequestInit)
                    .then(result => result.json())
                    .then(firstResponse => {
                        // console.log(`firstResponse`, JSON.stringify(firstResponse, null, 4));
                        var secondRequestInit: RequestInit = {
                            headers: {
                                'Authorization': `Bearer ${tokenResponse.res?.data.access_token}`
                            },
                        };
                        fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses', secondRequestInit)
                            .then(result => result.json())
                            .then(secondResponse => {
                                console.log(`secondResponse`, JSON.stringify(secondResponse, null, 4));
                                Authentication.Hash(firstResponse.email)
                                    .then((token) => {
                                        res.redirect(`${CONFIG.PublicUrl}/Index.html?info=loggedin&name=${firstResponse.name}&token=${token}&admin=false&id=${firstResponse.email}&friend_count=${secondResponse.totalPeople}`);
                                    })
                                    .catch((error) => {
                                        res.redirect(`${CONFIG.PublicUrl}/Index.html?error=${error.message}`);
                                    });
                            })
                            .catch(console.error);
                    })
                    .catch(console.error);

            });




            // var firstRequestInit: RequestInit = {
            //     method: 'POST',
            //     body: new URLSearchParams({
            //         client_id: discordClientId,
            //         client_secret: discordClientSecret,
            //         code: code as string,
            //         grant_type: "authorization_code",
            //         redirect_uri: discordRedirect
            //     }),
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            //     }
            // };
            // fetch('https://discordapp.com/api/oauth2/token', firstRequestInit)
            //     .then(result => result.json())
            //     .then(firstResponse => {
            //         // console.log(JSON.stringify(firstResponse));
            //         var secondRequestInit: RequestInit = {
            //             headers: {
            //                 authorization: `${firstResponse.token_type} ${firstResponse.access_token}`,
            //             },
            //         };
            //         fetch('https://discord.com/api/users/@me', secondRequestInit)
            //             .then(result => result.json())
            //             .then(secondResponse => {
            //                 // console.log(JSON.stringify(secondResponse));
            //                 Authentication.Hash(secondResponse.email)
            //                     .then((token) => {
            //                         res.redirect(`${CONFIG.PublicUrl}/Index.html?info=loggedin&name=${secondResponse.username}&token=${token}&admin=false&id=${secondResponse.email}`);
            //                     })
            //                     .catch((error) => {
            //                         res.redirect(`${CONFIG.PublicUrl}/Index.html?error=${error.message}`);
            //                     });
            //             })
            //             .catch(console.error);
            //     })
            //     .catch(console.error);
        });
    }
}

export default Google;