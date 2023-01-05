import express from 'express';
import fetch, { RequestInit } from 'node-fetch';
import CRYPT from '../../../UTIL/CRYPT';
import CONFIG, { discordAuthUrl, discordCallbackUrl } from '../../CONFIG/CONFIG';
import EXPRESS from '../../EXPRESS/EXPRESS';
import AUTH from './AUTH';
import DATA from '../../DATA/DATA';
import EMAIL from '../EMAIL';
import mongoose from 'mongoose';

class Discord 
{
    private static Instance: Discord;
    private static table: string = "discord";

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
            'connections',
            'guilds',
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

                var fourthRequestInit: RequestInit = {
                    method: 'GET',
                    headers: {
                        authorization: `${firstResponse.token_type} ${firstResponse.access_token}`,
                    },
                };
                let rawFourthResponse = await fetch('https://discord.com/api/users/@me/guilds', fourthRequestInit);
                let fourthResponse = await rawFourthResponse.json();
                console.log(`fourthResponse`, JSON.stringify(fourthResponse, null, 4));

                let guilds:{id:string, name:string}[] = [];
                fourthResponse.forEach((element:any) => {
                    guilds.push({
                        id:element.id,
                        name:element.name
                    });
                });

                var fifthRequestInit: RequestInit = {
                    method: 'GET',
                    headers: {
                        authorization: `${firstResponse.token_type} ${firstResponse.access_token}`,
                    },
                };
                console.log(`fifthRequestInit`, JSON.stringify(fifthRequestInit, null, 4));
                let rawFifthResponse = await fetch(`https://discord.com/api/guilds/${guilds[0].id}/channels`, fifthRequestInit);
                let fifthResponse = await rawFifthResponse.json();
                console.log(`fifthResponse`, JSON.stringify(fifthResponse, null, 4));
                
                let account:{[key:string]:any} = 
                {
                    username        : secondResponse.id,
                    firstName       : secondResponse.username,
                    email           : secondResponse.email,
                    type            : 'DISCORD'
                };

                console.log(`[Discord.js] account`, JSON.stringify(account, null, 4));

                let user = await AUTH.get(account);

                console.log(`[Discord.js] user`, JSON.stringify(user, null, 4));

                let entry = await this.getSet({
                    avatarID        : user.avatarID,
                    guilds          : guilds,
                    tokenType       : firstResponse.token_type,
                    accessToken     : firstResponse.access_token
                });
                
                console.log(`[Discord.ts] entry`, JSON.stringify(entry, null, 4));

                let searchParams:string = Object.keys(user).map(key => key + '=' + user[key]).join('&');
                res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?${searchParams}`);
            } catch (error: any) {
                res.redirect(`${CONFIG.vars.PUBLIC_FULL_URL}/Index.html?error=${error.message}`);
            }
        });
    }

    public static async Share(vars: { shareMessage:string, shareUrl:string, guild: { id:string, name:string }, avatarID:string }): Promise<void> {
        
        console.log(`vars`, JSON.stringify(vars, null, 4));
        let proxy = await DATA.getOne(this.table, { where: { avatarID: new mongoose.Types.ObjectId ( vars.avatarID ) }});
        console.log(`proxy`, JSON.stringify(proxy, null, 4));
        
        var firstRequestInit: RequestInit = {
            method: 'GET',
            headers: {
                authorization: `${proxy.tokenType} ${proxy.accessToken}`,
            },
            body: JSON.stringify({
                content: 'test'
            })
        };
        console.log(`firstRequestInit`, JSON.stringify(firstRequestInit, null, 4));
        let rawFirstResponse = await fetch(`https://discord.com/api/guilds/${vars.guild.id}/channels`, firstRequestInit);
        console.log(`rawFirstResponse`, JSON.stringify(rawFirstResponse, null, 4));
        let firstResponse = await rawFirstResponse.json();
        console.log(`firstResponse`, JSON.stringify(firstResponse, null, 4));
        
        var secondRequestInit: RequestInit = {
            method: 'GET',
            headers: {
                authorization: `${proxy.tokenType} ${proxy.accessToken}`,
            },
            body: JSON.stringify({
                content: 'test'
            })
        };
        console.log(`secondRequestInit`, JSON.stringify(secondRequestInit, null, 4));
        let rawSecondResponse = await fetch(`https://discord.com/api/guilds/${vars.guild.id}/channels`, secondRequestInit);
        console.log(`rawSecondResponse`, JSON.stringify(rawSecondResponse, null, 4));
        let secondResponse = await rawSecondResponse.json();
        console.log(`secondResponse`, JSON.stringify(secondResponse, null, 4));
        
        return Promise.resolve();
    }

    public static async ShareGet (vars: {avatarID:string }): Promise<void> {

        let proxy = await DATA.getOne(this.table, { where: { avatarID: new mongoose.Types.ObjectId ( vars.avatarID ) }});

        let guilds = proxy.guilds;
        
        return Promise.resolve(guilds);
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

export default Discord;