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

        EXPRESS.app.use(`${twitterCallbackUrl}`, async (req, res) => {

            // console.log('query callback');
            // console.log(JSON.stringify(req.query));
            // console.log('session callback');
            // console.log(JSON.stringify(req.session));

            try {

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

                let response = await twitterClient.loginWithOAuth2({
                    code: code as string,
                    codeVerifier: codeVerifier,
                    redirectUri: CONFIG.vars.TWITTER_CALLBACK_URL
                });

                // {response.loggedClient} is an authenticated client in behalf of some user
                // Store {response.accessToken} somewhere, it will be valid until {response.expiresIn} is hit.
                // If you want to refresh your token later, store {response.refreshToken} (it is present if 'offline.access' has been given as scope)

                const { data: userObject } = await response.client.v2.me();

                // GET FOLLOWERS
                let followers: UserV2[] = [];
                let isFinished: boolean = false;
                let pagination_token: string | undefined;
                while (!isFinished) {
                    var tmpFollowers = await response.client.v2.followers(userObject.id, {
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
                    accessToken : response.accessToken,
                    type        : 'TWITTER'
                };
                
                console.log(`account`, JSON.stringify(account, null, 4));

                let user = await AUTH.get(account);
                
                console.log(`user`, JSON.stringify(user, null, 4));

                let searchParams:string = Object.keys(user).map(key => key + '=' + user[key]).join('&');
                res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?${searchParams}`);
            } catch (error: any) {
                res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?error=${error.message}`);
            }
                    
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