import { TwitterApi, TwitterApiOAuth2Init } from 'twitter-api-v2';
import express from 'express';
import Environment, { twitterAuthUrl, twitterCallbackUrl, twitterRedirectUrl } from './Environment';
import fetch, { RequestInfo } from 'node-fetch';
import Authentication from './Authentication';

class Twitter {

    private static Instance: Twitter;
    private static codeVerifiers: { [key: string]: string }

    /**
     * Initialize email module.
     */
    public static async AsyncInit(app: express.Express, env: Environment.Config): Promise<void> {
        Twitter.Instance = new Twitter();
        Twitter.codeVerifiers = {};
        Twitter.WebhookAuthLink(app, env);
        Twitter.WebhookCallbackLink(app, env);
        return Promise.resolve();
    }

    public static async WebhookAuthLink(app: express.Express, env: Environment.Config): Promise<void> {
        app.use(`${twitterAuthUrl}`, (req, res) => {
            const twitterClient = new TwitterApi({
                clientId: env.TWITTER_CLIENT_ID,
                clientSecret: env.TWITTER_CLIENT_SECRET
            });

            const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(`${env.TWITTER_CALLBACK_URL}`, {
                scope: ['tweet.read', 'users.read']
            });
            Twitter.codeVerifiers[state] = codeVerifier;
            res.status(200).send({
                success: true,
                link: url
            });
        });
    }

    public static async WebhookCallbackLink(app: express.Express, env: Environment.Config): Promise<void> {
        app.use(`${twitterCallbackUrl}`, (req, res) => {
            console.log('query callback');
            console.log(JSON.stringify(req.query));
            console.log('session callback');
            console.log(JSON.stringify(req.session));

            const { state, code } = req.query;

            if (!Twitter.codeVerifiers[state as string]) {
                return res.status(400).send('Stored tokens didnt match!');
            }
            const twitterClient = new TwitterApi({
                clientId: env.TWITTER_CLIENT_ID,
                clientSecret: env.TWITTER_CLIENT_SECRET,
            });

            let codeVerifier = Twitter.codeVerifiers[state as string];
            console.log(JSON.stringify({ code, codeVerifier }));

            twitterClient.loginWithOAuth2({
                code: code as string,
                codeVerifier: codeVerifier,
                redirectUri: env.TWITTER_CALLBACK_URL
            })
                .then(async ({ client: loggedClient, accessToken, expiresIn, scope, refreshToken }) => {
                    // {loggedClient} is an authenticated client in behalf of some user
                    // Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
                    // If you want to refresh your token later, store {refreshToken} (it is present if 'offline.access' has been given as scope)

                    // res.status(200).send(JSON.stringify(result));

                    // Example request
                    const { data: userObject } = await loggedClient.v2.me();
                    const token = await Authentication.Hash(userObject.id);
                    res.redirect(`${Environment.PublicUrl}/Index.html?info=loggedin&name=${userObject.username}&token=${token}&admin=false&id=${userObject.id}`);
                })
                .catch(() => res.status(403).send('Invalid verifier or access tokens!'));
        });
    }
}

namespace Twitter {

}

export default Twitter;