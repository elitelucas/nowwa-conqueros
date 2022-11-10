import express from 'express';
import fetch, { RequestInit } from 'node-fetch';
import CONFIG, { discordAuthUrl, discordCallbackUrl } from '../../CONFIG/CONFIG';
import Authentication from '../../DEPRECATED/Authentication';
import EXPRESS from '../../EXPRESS/EXPRESS';
class Discord {
    private static Instance: Discord;

    /**
     * Initialize email module.
     */
    public static async init(): Promise<void> {
        Discord.Instance = new Discord();
        Discord.WebhookAuthLink();
        Discord.WebhookCallbackLink();
        return Promise.resolve();
    }

    public static async WebhookAuthLink(): Promise<void> {
        EXPRESS.app.use(`${discordAuthUrl}`, (req, res) => {

            let discordClientId: string = CONFIG.vars.DISCORD_CLIENT_ID;
            let discordRedirect: string = encodeURIComponent(`${CONFIG.PublicUrl}${discordCallbackUrl}`);
            let discordScopes: string[] = [
                'identify',
                'email',
                // 'relationships.read'
            ];
            let discordScope: string = encodeURIComponent(discordScopes.join(' '));
            let discordResponseType: string = `code`;
            let discordUrl: string = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${discordRedirect}&response_type=${discordResponseType}&scope=${discordScope}`;

            res.status(200).send({
                success: true,
                link: discordUrl
            });
        });
    }

    public static async WebhookCallbackLink(): Promise<void> {
        EXPRESS.app.use(`${discordCallbackUrl}`, (req, res) => {
            // console.log('query callback');
            // console.log(JSON.stringify(req.query));
            // console.log('session callback');
            // console.log(JSON.stringify(req.session));

            const { access_token, code } = req.query;

            let discordClientId: string = CONFIG.vars.DISCORD_CLIENT_ID;
            let discordClientSecret: string = CONFIG.vars.DISCORD_CLIENT_SECRET;
            let discordRedirect: string = `${CONFIG.PublicUrl}${discordCallbackUrl}`;

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
            fetch('https://discordapp.com/api/oauth2/token', firstRequestInit)
                .then(result => result.json())
                .then(firstResponse => {
                    console.log(`firstResponse`, JSON.stringify(firstResponse, null, 4));
                    if (firstResponse.error) {
                        res.redirect(`${CONFIG.PublicUrl}/Index.html?error=${firstResponse.error_description}`);
                        return;
                    }
                    var secondRequestInit: RequestInit = {
                        method: 'GET',
                        headers: {
                            authorization: `${firstResponse.token_type} ${firstResponse.access_token}`,
                        },
                    };
                    fetch('https://discord.com/api/users/@me', secondRequestInit)
                        .then(result => result.json())
                        .then(secondResponse => {
                            console.log(`secondResponse`, JSON.stringify(secondResponse, null, 4));
                            var thirdRequestInit: RequestInit = {
                                method: 'GET',
                                headers: {
                                    authorization: `${firstResponse.token_type} ${firstResponse.access_token}`,
                                },
                            };
                            fetch('https://discord.com/api/users/@me/connections', thirdRequestInit)
                                .then(result => result.json())
                                .then(thirdResponse => {
                                    console.log(`thirdResponse`, JSON.stringify(thirdResponse, null, 4));
                                    Authentication.Hash(secondResponse.email)
                                        .then((token) => {
                                            res.redirect(`${CONFIG.PublicUrl}/Index.html?info=loggedin&name=${secondResponse.username}&token=${token}&admin=false&id=${secondResponse.email}&friend_count=${thirdResponse.length}`);
                                        })
                                        .catch((error) => {
                                            res.redirect(`${CONFIG.PublicUrl}/Index.html?error=${error.message}`);
                                        });
                                })
                                .catch(console.error);
                        })
                        .catch(console.error);
                })
                .catch(console.error);
        });
    }
}

export default Discord;