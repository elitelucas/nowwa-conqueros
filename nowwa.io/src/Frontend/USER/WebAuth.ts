import CONFIG, { authLinks, authLogin, authRegister, authVerify } from "../../Core/CONFIG/CONFIG";
import { ACTIONS } from "../../Models/ENUM";
import { log } from "../../UTIL/LOG";
import CONQUER from "../CONQUER";
import Storage from "../UTILS/Storage";
import User from "./User";

class WebAuth 
{

    private readonly facebookAppId:string = `2303120786519319`;
 
    private conquer: CONQUER;

    public constructor( instance:CONQUER) {
        this.conquer = instance;
    }

    // Move all social stuff here
    private vars: { [key: string]: any } & 
    {
        twitter?    : string,
        discord?    : string,
        google?     : string,
        snapchat?   : string,
        facebook?   : boolean
    } = {};

    public async init(): Promise<any> 
    {

        // console.log('web auth initializing...');
        await this.authLinks();

        // console.log('web auth initialized!');

        return Promise.resolve();
    }

    private async authLinks(): Promise<void> 
    {
        if (typeof window != 'undefined') 
        {
            let authLinkResponse = await new Promise<any>((resolve, reject) => 
            {
                let authLinksUrl        : URL = new URL(`${CONFIG.vars.PUBLIC_FULL_URL}${authLinks}`);
                let authLinksRequest    : RequestInit = {
                    method              : "POST",
                    headers             : { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body                : '{}'
                };
                fetch(authLinksUrl, authLinksRequest)
                    .then(authLinkResponse => authLinkResponse.json())
                    .then((authLinkResponse: any) => {
                        resolve(authLinkResponse);
                    })
                    .catch((error: any) => {
                        console.error(`error: ${error}`);
                        reject(error);
                    });

            });
            this.vars.twitter   = authLinkResponse.twitter;
            this.vars.discord   = authLinkResponse.discord;
            this.vars.google    = authLinkResponse.google;
            this.vars.snapchat  = authLinkResponse.snapchat;
        }
    }

    public async discord(): Promise<any> 
    {
        window.open(this.vars.discord, "_self");
    }

    public async twitter(): Promise<any> 
    {
        window.open(this.vars.twitter, "_self");
    };

    public async snapchat(): Promise<any> 
    {
        window.open(this.vars.snapchat, "_self");
    };

    public async google(): Promise<any> 
    {
        window.open(this.vars.google, "_self");
    }
    
    public async metamask(): Promise<any> 
    {
        let self        = this;
        let ethereum    = (window as any).ethereum;

        if (!ethereum) 
        {
            alert('install metamask wallet first!');
        } else {
            try {
                let address = await new Promise<string>((resolve, reject) => 
                {
                    (window as any).ethereum
                        .request(
                        {
                            method: "eth_requestAccounts",
                        })
                        .then((accounts: string[]) => 
                        {
                            let address = accounts[0];
                            resolve(address);
                        })
                        .catch((error: any) => {
                            reject(error);
                        });
                });

                let redirectParams:{[key:string]:any} = 
                {
                    username    : address,
                    wallet      : address,
                    type        : 'METAMASK'
                };

                let searchParams:string = Object.keys(redirectParams).map(key => key + '=' + redirectParams[key]).join('&');
    
                if (window.location.href.indexOf('?') >= 0) {
                    window.location.replace(`${window.location.href}&${searchParams}`);
                } else {
                    window.location.replace(`${window.location.href}?${searchParams}`);
                }

            } catch( error ) 
            {
                return Promise.resolve({
                    success : false,
                    account : error
                });
            }
        }
    }
    
    public async facebook(): Promise<any> 
    {
        if (typeof window != 'undefined') {

            if (!this.vars.facebook) 
            {
                await new Promise<void>((resolve, reject) => 
                {
                    let facebookScript      = document.createElement('script');
                    facebookScript.type     = 'text/javascript';
                    facebookScript.src      = 'https://connect.facebook.net/en_US/sdk.js';
                    facebookScript.async    = true;
                    facebookScript.defer    = true;

                    facebookScript.onload = () => {
                        
                        FB.init(
                        {
                            appId: this.facebookAppId,
                            autoLogAppEvents: true,
                            xfbml: true,
                            version: 'v15.0'
                        });

                        FB.AppEvents.logPageView();
                        resolve();
                    }
                    document.body.appendChild(facebookScript);
                });
                this.vars.facebook = true;
            }
            
            let loginStatus = await new Promise<fb.StatusResponse>((resolve, reject) => 
            {
                FB.getLoginStatus((loginStatus) => 
                {
                    // console.log(`loginStatus`, JSON.stringify(loginStatus, null, 4));
                    // statusChangeCallback(response);
                    resolve(loginStatus);
                });
            });

            let authResponse = loginStatus.authResponse;

            if (!authResponse) 
            {
                authResponse = await new Promise<fb.AuthResponse>((resolve, reject) => 
                {
                    FB.login((loginResponse: fb.StatusResponse) => 
                    {
                        resolve(loginResponse.authResponse);
                    }, { scope: 'public_profile,email,user_friends' });
                });
            }

            let fields: string[] = 
            [
                'name',
                'email',
            ];

            let apiResponse1 = await new Promise<fb.StatusResponse>((resolve, reject) => 
            {
                FB.api('/me', { fields: fields.join(', ') }, (apiResponse1: any) => {
                    resolve(apiResponse1);
                });
            });

            let apiResponse2 = await new Promise<fb.StatusResponse>((resolve, reject) => 
            {
                FB.api('/me/friends', {}, (apiResponse2: any) => 
                {
                    resolve(apiResponse2);
                });
            });

            let userInfo    = apiResponse1 as any;
            let contactInfo = apiResponse2 as any;

            let friend_count    = contactInfo.summary.total_count;

            let redirectParams:{[key:string]:any} = 
            {
                username        : userInfo.email,
                email           : userInfo.email,
                firstName       : userInfo.name,
                type            : 'FACEBOOK'
            };

            let searchParams:string = Object.keys(redirectParams).map(key => key + '=' + redirectParams[key]).join('&');

            if (window.location.href.indexOf('?') >= 0) {
                window.location.replace(`${window.location.href}&${searchParams}`);
            } else {
                window.location.replace(`${window.location.href}?${searchParams}`);
            }
        }

    }

    public async shareGoogleGet ( ) : Promise<any> 
    {
        let avatarID:string = this.conquer.User!.avatarID!;

        return this.conquer.do( ACTIONS.SOCIAL_GOOGLE_SHARE_GET, { avatarID } );
    }
 
    public async shareGoogle ( email:string ) : Promise<any> 
    {
        let shareMessage:string = `Join supersnappy.io!`;
        let shareUrl:string = `https://supersnappy.io`;

        return this.conquer.do( ACTIONS.SOCIAL_GOOGLE_SHARE, { shareMessage, shareUrl, email }  );  
    }
 
    public async shareTwitter ( ) : Promise<any> 
    {
        let shareMessage:string = `Join supersnappy.io!`;
        let shareUrl:string = `https://supersnappy.io`;
        let avatarID:string = this.conquer.User!.avatarID!;

        return this.conquer.do( ACTIONS.SOCIAL_TWITTER_SHARE, { avatarID, shareMessage, shareUrl }  );  
    }
 
    public async shareFacebook ( ) : Promise<any> 
    {
        if (typeof window != 'undefined') {

            if (!this.vars.facebook) 
            {
                await new Promise<void>((resolve, reject) => 
                {
                    let facebookScript      = document.createElement('script');
                    facebookScript.type     = 'text/javascript';
                    facebookScript.src      = 'https://connect.facebook.net/en_US/sdk.js';
                    facebookScript.async    = true;
                    facebookScript.defer    = true;

                    facebookScript.onload = () => {
                        
                        FB.init(
                        {
                            appId: this.facebookAppId,
                            autoLogAppEvents: true,
                            xfbml: true,
                            version: 'v15.0'
                        });

                        FB.AppEvents.logPageView();
                        resolve();
                    }
                    document.body.appendChild(facebookScript);
                });
                this.vars.facebook = true;
            }

            await new Promise<void>((resolve, reject) => 
            {
                let shareMessage:string = `Join supersnappy.io!`;
                let shareUrl:string = `https://supersnappy.io`;
                FB.ui({
                    method: 'share',
                    href: shareUrl,
                    quote: shareMessage,
                }, (response: fb.ShareDialogResponse) => {
                    resolve();
                });
            });
        }
        return Promise.resolve();
    }
}

 
export default WebAuth;