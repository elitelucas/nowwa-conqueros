import express from 'express';
import fetch, { RequestInit } from 'node-fetch';
import WebAuth from '../../../Frontend/USER/WebAuth';
import CRYPT from '../../../UTIL/CRYPT';
import CONFIG, { snapchatAuthUrl, snapchatCallbackUrl } from '../../CONFIG/CONFIG';
import EXPRESS from '../../EXPRESS/EXPRESS';
import AUTH from './AUTH';

class Snapchat 
{
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

    public static get AuthLink(): string 
    {
        let snapchatClientId: string = `e6a503b3-6929-4feb-a6d9-b1dc0bd963ed`;
        let snapchatRedirect: string = encodeURIComponent(`${CONFIG.vars.PUBLIC_FULL_URL}${snapchatCallbackUrl}`);
        let snapchatState: string = `g0qVDoSOERd-6ClRJoCoZOI-nHrpln8XKXYwLJoXbg8`;
        let snapchatScopeList: string[] = [
            "https://auth.snapchat.com/oauth2/api/user.display_name",
            "https://auth.snapchat.com/oauth2/api/user.bitmoji.avatar",
            "https://auth.snapchat.com/oauth2/api/user.external_id",
        ];
        let snapchatScope: string = encodeURIComponent(snapchatScopeList.join(' '));
        let snapchatResponseType: string = `code`;
        let snapchatUrl: string = `https://accounts.snapchat.com/accounts/oauth2/auth?client_id=${snapchatClientId}&redirect_uri=${snapchatRedirect}&response_type=${snapchatResponseType}&scope=${snapchatScope}&state=${snapchatState}`;
        return snapchatUrl;
    }

    public static async WebhookCallbackLink(): Promise<void> 
    {
        EXPRESS.app.use(`${snapchatCallbackUrl}`, (req, res) => 
        {
            // console.log('query callback');
            // console.log(JSON.stringify(req.query, null, "\t"));
            // console.log('session callback');
            // console.log(JSON.stringify(req.session, null, "\t"));

            const { access_token, code } = req.query;

            let snapchatClientId: string = CONFIG.vars.SNAPCHAT_CLIENT_ID;
            let snapchatClientSecret: string = CONFIG.vars.SNAPCHAT_CLIENT_SECRET;
            let snapchatRedirect: string = `${CONFIG.vars.PUBLIC_FULL_URL}${snapchatCallbackUrl}`;

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

            var firstRequestInit: RequestInit =
            {
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
                            CRYPT.tokenize(id)
                                .then((token) => {
                                    // TODO : change 'id' with actual 'avatarID' for proxy login
                                    let account:WEBAUTH.Account = {
                                        avatarID: id,
                                        admin: false,
                                        friend_count: 0,
                                        username: id,
                                        firstName: name,
                                        token: token,
                                        type: 'SNAPCHAT'
                                    };
                                    let searchParams:URLSearchParams = Object.assign(new URLSearchParams(), account);
                                    res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?info=loggedin&${searchParams.toString()}`);
                                })
                                .catch((error) => {
                                    res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?error=${error.message}`);
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