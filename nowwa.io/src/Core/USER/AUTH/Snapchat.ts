import express from 'express';
import fetch, { RequestInit } from 'node-fetch';
import Storage from '../../../Conquer/UTILS/Storage';
import CRYPT from '../../../UTIL/CRYPT';
import CONFIG, { snapchatAuthUrl, snapchatCallbackUrl } from '../../CONFIG/CONFIG';
import EXPRESS from '../../EXPRESS/EXPRESS';
import AUTH from './AUTH';
import DATA from '../../DATA/DATA';

class Snapchat 
{
    private static Instance: Snapchat;
    private static table: string = "snapchat";

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
        EXPRESS.app.use(`${snapchatCallbackUrl}`, async (req, res) => 
        {
            // console.log('query callback');
            // console.log(JSON.stringify(req.query, null, "\t"));
            // console.log('session callback');
            // console.log(JSON.stringify(req.session, null, "\t"));

            try {

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

                let rawFirstResponse = await fetch('https://accounts.snapchat.com/accounts/oauth2/token', firstRequestInit);
                let firstResponse = await rawFirstResponse.json();
                
                var secondRequestInit: RequestInit = {
                    method: 'POST',
                    body: JSON.stringify({ "query": "{me{displayName bitmoji{avatar} externalId}}" }),
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${firstResponse.access_token}`
                    }
                };
                let rawSecondResponse = await fetch('https://kit.snapchat.com/v1/me', secondRequestInit)
                let secondResponse = await rawSecondResponse.json();
                
                // console.log('secondResponse callback');
                // console.log(JSON.stringify(secondResponse, null, "\t"));
                let id = Buffer.from(secondResponse.data.me.externalId).toString('base64');
                let name = secondResponse.data.me.displayName;

                let account:{[key:string]:any} = 
                {
                    username        : id,
                    firstName       : name,
                    type            : 'SNAPCHAT'
                };
                
                console.log(`[Snapchat.ts] account`, JSON.stringify(account, null, 4));
                
                let user = await AUTH.get(account);
                
                console.log(`[Snapchat.ts] user`, JSON.stringify(user, null, 4));

                let entry = await this.getSet({
                    avatarID        : user.avatarID,
                    access_token    : firstResponse.access_token
                });
                
                console.log(`[Snapchat.ts] entry`, JSON.stringify(entry, null, 4));

                let searchParams:string = Object.keys(user).map(key => key + '=' + user[key]).join('&');
                res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?${searchParams}`);
            } catch (error: any) {
                res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?error=${error.message}`);
            }
        });
    }
 
    /*=============== 


    GET SET 
    

    ================*/
  
    public static async getSet( vars:any  ) : Promise<any>
    {

        let item = await DATA.getOne( this.table, { usernameID:vars.usernameID });

        if( !item ) item = await DATA.set( this.table, vars );
 
        return Promise.resolve( item );
    }; 
}
 

export default Snapchat;