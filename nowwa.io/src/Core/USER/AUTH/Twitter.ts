import { TwitterApi, UserV2 } from 'twitter-api-v2';
import Storage from '../../../Frontend/UTILS/Storage';
import CRYPT from '../../../UTIL/CRYPT';
import CONFIG, { twitterCallbackUrl, twitterShareUrl } from '../../CONFIG/CONFIG';
import EXPRESS from '../../EXPRESS/EXPRESS';
import AUTH from './AUTH';
import AVATAR from '../TRIBE/AVATAR';
import mongoose from 'mongoose';
import USERNAME from '../USERNAME';
import USERNAME_PROXY from '../USERNAME_PROXY';

class Twitter {

    private static Instance: Twitter;
    private static codeVerifiers: { [key: string]: string }

    /**
     * Initialize email module.
     */
    public static async init(): Promise<void> {
        Twitter.Instance = new Twitter();
        Twitter.codeVerifiers = {};
        Twitter.WebhookCallbackLink();
        return Promise.resolve();
    }

    public static get AuthLink(): string {
        const twitterClient = new TwitterApi({
            clientId: CONFIG.vars.TWITTER_CLIENT_ID,
            clientSecret: CONFIG.vars.TWITTER_CLIENT_SECRET
        });

        const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(`${CONFIG.vars.TWITTER_CALLBACK_URL}`, {
            scope: ['tweet.read', 'users.read', 'follows.read', 'tweet.write']
        });
        Twitter.codeVerifiers[state] = codeVerifier;
        return url;
    }

    public static async WebhookCallbackLink(): Promise<void> {
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

                    let account:{[key:string]:any} = 
                    {
                        username    : userObject.id,
                        firstName   : userObject.username,
                        accessToken : accessToken,
                        type        : 'TWITTER'
                    };

                    console.log(`accessToken`, accessToken);

                    let searchParams:string = Object.keys(account).map(key => key + '=' + account[key]).join('&');
                    res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?${searchParams}`);
                })
                .catch(() => res.status(403).send('Invalid verifier or access tokens!'));
        });
    }
    

    public static async Share(vars: {avatarID:string, shareMessage:string, shareUrl:string}): Promise<void> {

        let avatar = await AVATAR.getOne({ _id: new mongoose.Types.ObjectId ( vars.avatarID ) });

        let proxy = await USERNAME_PROXY.get({ where: { usernameID: new mongoose.Types.ObjectId ( avatar.usernameID ) }});

        let accessToken = proxy.accessToken;

        const twitterClient = new TwitterApi(accessToken as string);

        let result = await twitterClient.v2.tweet(vars.shareMessage + ' ' + vars.shareUrl);
        
        return Promise.resolve();
    }
}

namespace Twitter {

}

export default Twitter;