import { authLinks, authLogin, authRegister, authVerify } from "../../Core/CONFIG/CONFIG";
import AUTH from "./AUTH";
import { log } from "../../UTIL/LOG";
import CONQUER from "../CONQUER";
import LOCALSTORAGE from "../UTILS/LOCALSTORAGE";

class WEBAUTH 
{
 
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
        await this.redirect();
        await this.authLinks();
        return Promise.resolve();
    }
 
    private async redirect(): Promise<void> 
    {
        // TODO : actually redirect to specific site after verifying the credentials
        // e.g. redirect to nowwa.io
        let params = LOCALSTORAGE.searchParams;

        if( params.source ) 
        {
            log(`[${params.source}] verifying user...`);

            let authVerifyResponse = await new Promise<any>((resolve, reject) => 
            {
                let authVerifyUrl       : URL = new URL(`${window.location.origin}${authVerify}`);
                let authVerifyRequest   : RequestInit = 
                {
                    method  : "POST",
                    headers : { 'Content-Type': 'application/json' },
                    body    : JSON.stringify(
                    {
                        id      : params.id,
                        token   : params.token
                    })
                };

                fetch(authVerifyUrl, authVerifyRequest)
                    .then(authVerifyResponse => authVerifyResponse.json())
                    .then((authVerifyResponse: any) => {
                        log(`authResponse`, JSON.stringify(authVerifyResponse, null, 4));
                        resolve(authVerifyResponse);
                    })
                    .catch((error: any) => {
                        console.error(`error: ${error}`);
                        reject(error);
                    });
            });

            log(`[${params.source}] verified: ${authVerifyResponse && authVerifyResponse.valid}!`);

            if (authVerifyResponse.success) 
            {
                if (authVerifyResponse.valid) 
                {
                    // TODO : change 'params.id' with actual 'avatarID' for proxy login
                    let account:LOCALSTORAGE.Account = 
                    {
                        avatarID        : params.id,
                        username        : params.id,
                        friend_count    : parseInt(params.friend_count as string || "0"),
                        admin           : params.admin as string == 'true',
                        firstName       : params.name,
                        email           : params.email,
                        wallet          : params.wallet,
                        token           : params.token, // made by us 
                        type            : params.source // GOOGLE, DISCORD, SNAPCHAT, TWITTER

                        /*
                            have this contain

                            username (id, can be email, wallet, number id),
                            firstName ( persons name),
                            email (if exists),
                            wallet (if exists),
                            type ( source, where's this from)

                            GOOGLE username: email
                            DISCORD username: email
                            TWITTER username: userID (number)
                            SNAPCHAT username: accountID (number)
                            FACEBOOK username: userID
                        */
                    };

                    LOCALSTORAGE.setAccount( account );
                }
            }
        }
        return Promise.resolve();
    }

 
    private async authLinks(): Promise<void> 
    {
        if (typeof window != 'undefined') 
        {
            let authLinkResponse = await new Promise<any>((resolve, reject) => 
            {
                let authLinksUrl        : URL = new URL(`${window.location.origin}${authLinks}`);
                let authLinksRequest    : RequestInit = {
                    method              : "POST",
                    headers             : { 'Content-Type': 'application/json' },
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

                let token = await this.tokenize( <string>address );

                // TODO : change 'address' with actual 'avatarID' for proxy login
                let account : LOCALSTORAGE.Account = 
                {
                    avatarID        : address,
                    admin           : false,
                    username        : address, 
                    firstName       : address,
                    wallet          : address,
                    token           : token,
                    friend_count    : 0,
                    type            : 'METAMASK'
                };

                LOCALSTORAGE.setAccount( account );

                return Promise.resolve(
                {
                    success : true,
                    account : account
                });

            } catch( error ) 
            {
                return Promise.resolve(
                {
                    success : false,
                    account : error
                });
            }
        }
    }

    public async facebook(): Promise<any> 
    {
        return new Promise(async (resolve, reject) => 
        {
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

                        let facebookAppId: string = `2303120786519319`
                        
                        FB.init(
                        {
                            appId: facebookAppId,
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
            let token       = await this.tokenize( userInfo.email as string ); 

            // TODO : change 'userInfo.email' with actual 'avatarID' for proxy login
            let account : LOCALSTORAGE.Account =
            {
                avatarID        : userInfo.email,
                admin           : false,
                username        : userInfo.email,
                email           : userInfo.email,
                firstName       : userInfo.name,
                token           : token,
                friend_count    : contactInfo.summary.total_count,
                type            : 'FACEBOOK'
            };
 
            LOCALSTORAGE.setAccount( account );
 
            resolve({
                success : true,
                account : account
            });
        });
    }

    private async tokenize( string:string ) : Promise<any> 
    {
        return CONQUER.do( "CRYPT.tokenize", string )
    };
}

 
export default WEBAUTH;