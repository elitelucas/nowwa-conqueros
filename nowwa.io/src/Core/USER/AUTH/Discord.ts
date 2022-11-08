import express from 'express';
import fetch, { RequestInit } from 'node-fetch';
import CONFIG, { discordCallbackUrl } from '../../CONFIG/CONFIG';
import Authentication from '../../DEPRECATED/Authentication';

class Discord {

    private static Instance: Discord;

    /**
     * Initialize email module.
     */
    public static async AsyncInit(app: express.Express, env: CONFIG.Config): Promise<void> {
        Discord.Instance = new Discord();
        Discord.WebhookCallbackLink(app, env);
        return Promise.resolve();
    }

    public static async WebhookCallbackLink(app: express.Express, env: CONFIG.Config): Promise<void> {
        app.use(`${discordCallbackUrl}`, (req, res) => {
            // console.log('query callback');
            // console.log(JSON.stringify(req.query));
            // console.log('session callback');
            // console.log(JSON.stringify(req.session));

            const { access_token, code } = req.query;

            let discordClientId: string = env.DISCORD_CLIENT_ID;
            let discordClientSecret: string = env.DISCORD_CLIENT_SECRET;
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
                    // console.log(JSON.stringify(firstResponse));
                    var secondRequestInit: RequestInit = {
                        headers: {
                            authorization: `${firstResponse.token_type} ${firstResponse.access_token}`,
                        },
                    };
                    fetch('https://discord.com/api/users/@me', secondRequestInit)
                        .then(result => result.json())
                        .then(secondResponse => {
                            // console.log(JSON.stringify(secondResponse));
                            Authentication.Hash(secondResponse.email)
                                .then((token) => {
                                    res.redirect(`${CONFIG.PublicUrl}/Index.html?info=loggedin&name=${secondResponse.username}&token=${token}&admin=false&id=${secondResponse.email}`);
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

export default Discord;