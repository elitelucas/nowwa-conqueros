import express from 'express';
import fetch, { RequestInit } from 'node-fetch';
import CONFIG, { snapchatCallbackUrl } from '../../CONFIG/CONFIG';
import Authentication from '../../DEPRECATED/Authentication';
import EXPRESS from '../../EXPRESS/EXPRESS';

class Snapchat {

    private static Instance: Snapchat;

    /**
     * Initialize email module.
     */
    public static async init(): Promise<void> 
    {
        Snapchat.Instance = new Snapchat();
        Snapchat.WebhookCallbackLink();
        return Promise.resolve();
    }

    public static async WebhookCallbackLink(): Promise<void> 
    {
        EXPRESS.app.use(`${snapchatCallbackUrl}`, (req, res) => {
            // console.log('query callback');
            // console.log(JSON.stringify(req.query, null, "\t"));
            // console.log('session callback');
            // console.log(JSON.stringify(req.session, null, "\t"));

            const { access_token, code } = req.query;

            let snapchatClientId: string = CONFIG.vars.SNAPCHAT_CLIENT_ID;
            let snapchatClientSecret: string = CONFIG.vars.SNAPCHAT_CLIENT_SECRET;
            let snapchatRedirect: string = `${CONFIG.PublicUrl}${snapchatCallbackUrl}`;

            let hexEncode = (input: string): string => {
                var hex, i;

                var result = "";
                for (let i = 0; i < input.length; i++) {
                    hex = input.charCodeAt(i).toString(16);
                    result += ("000" + hex).slice(-4);
                }

                return result;
            };
            let snapchatFirstHeader: string = hexEncode(`${snapchatClientId}:${snapchatClientSecret}`);

            var firstRequestInit: RequestInit = {
                method: 'POST',
                body: new URLSearchParams({
                    client_id: snapchatClientId,
                    client_secret: snapchatClientSecret,
                    code: code as string,
                    grant_type: "authorization_code",
                    redirect_uri: snapchatRedirect
                }),
                headers: {
                    'Authorization': `Basic ${snapchatFirstHeader}`
                }
            };
            fetch('https://accounts.snapchat.com/accounts/oauth2/token', firstRequestInit)
                .then(result => result.json())
                .then(firstResponse => {
                    // console.log('firstResponse callback');
                    // console.log(JSON.stringify(firstResponse, null, "\t"));
                    var secondRequestInit: RequestInit = {
                        method: 'POST',
                        body: JSON.stringify({ "query": "{me{displayName bitmoji{avatar} externalId}}" }),
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${firstResponse.access_token}`
                        }
                    };
                    fetch('https://kit.snapchat.com/v1/me', secondRequestInit)
                        .then(result => result.json())
                        .then(secondResponse => {
                            // console.log('secondResponse callback');
                            // console.log(JSON.stringify(secondResponse, null, "\t"));
                            let id = Buffer.from(secondResponse.data.me.externalId).toString('base64');
                            let name = secondResponse.data.me.displayName;
                            Authentication.Hash(id)
                                .then((token) => {
                                    res.redirect(`${CONFIG.PublicUrl}/Index.html?info=loggedin&name=${name}&token=${token}&admin=false&id=${id}`);
                                })
                                .catch((error) => {
                                    res.redirect(`${CONFIG.PublicUrl}/Index.html?error=${error.message}`);
                                });
                        })
                        .catch(console.error);
                })
                .catch(console.error);
        });
    }
}

namespace Discord {

}

export default Snapchat;