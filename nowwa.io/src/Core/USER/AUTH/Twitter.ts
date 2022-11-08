import { TwitterApi, UserV2 } from 'twitter-api-v2';
import express from 'express';
import CONFIG, { twitterAuthUrl, twitterCallbackUrl } from '../../CONFIG/CONFIG';
import Authentication from '../../DEPRECATED/Authentication';
import EXPRESS from '../../EXPRESS/EXPRESS';

class Twitter {

    private static Instance: Twitter;
    private static codeVerifiers: { [key: string]: string }

    /**
     * Initialize email module.
     */
    public static async AsyncInit(): Promise<void> {
        Twitter.Instance = new Twitter();
        Twitter.codeVerifiers = {};
        Twitter.WebhookAuthLink();
        Twitter.WebhookCallbackLink();
        return Promise.resolve();
    }

    public static async WebhookAuthLink(): Promise<void> 
    {
        EXPRESS.app.use(`${twitterAuthUrl}`, (req, res) => {
            const twitterClient = new TwitterApi({
                clientId: CONFIG.vars.TWITTER_CLIENT_ID,
                clientSecret: CONFIG.vars.TWITTER_CLIENT_SECRET
            });

            const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(`${CONFIG.vars.TWITTER_CALLBACK_URL}`, {
                scope: ['tweet.read', 'users.read', 'follows.read']
            });
            Twitter.codeVerifiers[state] = codeVerifier;
            res.status(200).send({
                success: true,
                link: url
            });
        });
    }

    public static async WebhookCallbackLink(): Promise<void> 
    {
        EXPRESS.app.use(`${twitterCallbackUrl}`, (req, res) => {
            console.log('query callback');
            console.log(JSON.stringify(req.query));
            console.log('session callback');
            console.log(JSON.stringify(req.session));

            const { state, code } = req.query;

            if (!Twitter.codeVerifiers[state as string]) {
                return res.status(400).send('Stored tokens didnt match!');
            }
            const twitterClient = new TwitterApi({
                clientId: CONFIG.vars.TWITTER_CLIENT_ID,
                clientSecret: CONFIG.vars.TWITTER_CLIENT_SECRET,
            });

            let codeVerifier = Twitter.codeVerifiers[state as string];
            console.log(JSON.stringify({ code, codeVerifier }));

            twitterClient.loginWithOAuth2({
                code: code as string,
                codeVerifier: codeVerifier,
                redirectUri: CONFIG.vars.TWITTER_CALLBACK_URL
            })
                .then(async ({ client: loggedClient, accessToken, expiresIn, scope, refreshToken }) => {
                    // {loggedClient} is an authenticated client in behalf of some user
                    // Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
                    // If you want to refresh your token later, store {refreshToken} (it is present if 'offline.access' has been given as scope)

                    const { data: userObject } = await loggedClient.v2.me();

                    // GET FOLLOWERS
                    let followers: UserV2[] = [];
                    let isFinished: boolean = false;
                    let pagination_token: string | undefined;
                    while (!isFinished) {
                        var tmpFollowers = await loggedClient.v2.followers(userObject.id, {
                            pagination_token: pagination_token
                        });
                        followers = followers.concat(tmpFollowers.data);
                        if (!tmpFollowers.meta.next_token) {
                            isFinished = true;
                        } else {
                            pagination_token = tmpFollowers.meta.next_token;
                        }
                    }
                    // console.log(`followers`, followers);

                    const token = await Authentication.Hash(userObject.id);
                    res.redirect(`${CONFIG.PublicUrl}/Index.html?info=loggedin&name=${userObject.username}&token=${token}&admin=false&id=${userObject.id}&friend_count=${followers.length}`);
                })
                .catch(() => res.status(403).send('Invalid verifier or access tokens!'));
        });
    }
}

namespace Twitter {

}

export default Twitter;