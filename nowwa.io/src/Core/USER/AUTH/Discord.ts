import express from 'express';
import fetch, { RequestInit } from 'node-fetch';
import CRYPT from '../../../UTIL/CRYPT';
import CONFIG, { discordAuthUrl, discordCallbackUrl } from '../../CONFIG/CONFIG';
import EXPRESS from '../../EXPRESS/EXPRESS';
import AUTH from './AUTH';

class Discord 
{
    private static Instance: Discord;

    /**
     * Initialize email module.
     */
    public static async init(): Promise<void> 
    {
        Discord.Instance = new Discord();
        Discord.WebhookCallbackLink();
        return Promise.resolve();
    }

    public static get AuthLink(): string 
    {
        let discordClientId: string = CONFIG.vars.DISCORD_CLIENT_ID;
        let discordRedirect: string = encodeURIComponent(`${CONFIG.vars.DISCORD_CALLBACK_URL}`);
        let discordScopes: string[] = [
            'identify',
            'email',
            // 'relationships.read'
        ];
        let discordScope: string = encodeURIComponent(discordScopes.join(' '));
        let discordResponseType: string = `code`;
        let discordUrl: string = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${discordRedirect}&response_type=${discordResponseType}&scope=${discordScope}`;
        return discordUrl;
    }

    public static async WebhookCallbackLink(): Promise<void> 
    {
        EXPRESS.app.use(`${discordCallbackUrl}`, async (req, res) => 
        {
            // console.log('query callback');
            // console.log(JSON.stringify(req.query));
            // console.log('session callback');
            // console.log(JSON.stringify(req.session));

            try {

                const { access_token, code } = req.query;

                let discordClientId: string = CONFIG.vars.DISCORD_CLIENT_ID;
                let discordClientSecret: string = CONFIG.vars.DISCORD_CLIENT_SECRET;
                let discordRedirect: string = `${CONFIG.vars.PUBLIC_FULL_URL}${discordCallbackUrl}`;

                var firstRequestInit: RequestInit = {
                    method: 'POST',
                    body: new URLSearchParams({
                        client_id: discordClientId,
                        client_secret: discordClientSecret,
                        code: code as string,
                        grant_type: "authorization_code",
                        redirect_uri: discordRedirect
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };

                let rawFirstResponse = await fetch('https://discordapp.com/api/oauth2/token', firstRequestInit);
                let firstResponse = await rawFirstResponse.json();
                
                console.log(`firstResponse`, JSON.stringify(firstResponse, null, 4));
                if (firstResponse.error) {
                    res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?error=${firstResponse.error_description}`);
                    return;
                }
                var secondRequestInit: RequestInit = {
                    method: 'GET',
                    headers: {
                        authorization: `${firstResponse.token_type} ${firstResponse.access_token}`,
                    },
                };

                let rawSecondResponse = await fetch('https://discord.com/api/users/@me', secondRequestInit)
                let secondResponse = await rawSecondResponse.json();

                console.log(`secondResponse`, JSON.stringify(secondResponse, null, 4));
                var thirdRequestInit: RequestInit = {
                    method: 'GET',
                    headers: {
                        authorization: `${firstResponse.token_type} ${firstResponse.access_token}`,
                    },
                };

                let rawThirdResponse = await fetch('https://discord.com/api/users/@me/connections', thirdRequestInit);
                let thirdResponse = await rawThirdResponse.json();
                
                console.log(`thirdResponse`, JSON.stringify(thirdResponse, null, 4));

                let friend_count = thirdResponse.length;
                
                let account:{[key:string]:any} = 
                {
                    username        : secondResponse.email,
                    firstName       : secondResponse.username,
                    email           : secondResponse.email,
                    type            : 'DISCORD'
                };

                let user = await AUTH.get(account);

                let searchParams:string = Object.keys(user).map(key => key + '=' + user[key]).join('&');
                res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?${searchParams}`);
            } catch (error: any) {
                res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?error=${error.message}`);
            }
        });
    }
}

export default Discord;