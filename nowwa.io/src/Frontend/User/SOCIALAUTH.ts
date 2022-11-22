import { authLinks, authLogin, authRegister, authVerify } from "../../Core/CONFIG/CONFIG";
import { log } from "../../UTIL/LOG";
import CONQUER from "../CONQUER";

class SOCIALAUTH {
    // Move all social stuff here
    private vars: { [key: string]: any } & {
        twitter?: string,
        discord?: string,
        google?: string,
        snapchat?: string,
        facebook?: boolean
    } = {};

    public async init(): Promise<any> {
        /*
        Get session, from cookie?
        If session exists, login via backdoor?
        If session expired, log in as guest
        */

        await this.redirect();
        await this.authLinks();

        var guestUsername: string = "guest123";


        return Promise.resolve();
    }

    private async redirect(): Promise<void> {

        // TODO : actually redirect to specific site after verifying the credentials
        // e.g. redirect to nowwa.io
        let params = CONQUER.SearchParams;

        if (params.source) {

            log(`[${params.source}] verifying user...`);
            let authVerifyResponse = await new Promise<any>((resolve, reject) => {
                let authVerifyUrl: URL = new URL(`${window.location.origin}${authVerify}`);
                let authVerifyRequest: RequestInit = {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            id: params.id,
                            token: params.token
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

            if (authVerifyResponse.success) {
                if (authVerifyResponse.valid) {
                    CONQUER.AUTH.account = {
                        admin: params.admin as string == 'true',
                        id: params.id,
                        name: params.name,
                        token: params.token,
                        friend_count: parseInt(params.friend_count as string || "0")
                    }
                    return Promise.resolve();
                } else {
                    return Promise.reject(new Error("invalid credentials"));
                }
            }
        }
        return Promise.resolve();
    }

    private async authLinks(): Promise<void> {

        if (typeof window != 'undefined') {

            let authLinkResponse = await new Promise<any>((resolve, reject) => {
                let authLinksUrl: URL = new URL(`${window.location.origin}${authLinks}`);
                let authLinksRequest: RequestInit = {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: '{}'
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
            this.vars.twitter = authLinkResponse.twitter;
            this.vars.discord = authLinkResponse.discord;
            this.vars.google = authLinkResponse.google;
            this.vars.snapchat = authLinkResponse.snapchat;
        }
    }

    public async discord(): Promise<any> {
        window.open(this.vars.discord, "_self");
    }

    public async twitter(): Promise<any> {
        window.open(this.vars.twitter, "_self");
    };

    public async snapchat(): Promise<any> {
        window.open(this.vars.snapchat, "_self");
    };

    public async google(): Promise<any> {
        window.open(this.vars.google, "_self");
    }

    public async metamask(): Promise<any> {
        let self = this;
        let ethereum = (window as any).ethereum;
        if (!ethereum) {
            alert('install metamask wallet first!');
        } else {
            try {
                let address = await new Promise<string>((resolve, reject) => {
                    (window as any).ethereum
                        .request({
                            method: "eth_requestAccounts",
                        })
                        .then((accounts: string[]) => {
                            let address = accounts[0];
                            resolve(address);
                        })
                        .catch((error: any) => {
                            reject(error);
                        });
                });

                let token = await CONQUER.AUTH.tokenize(<string>address);

                CONQUER.AUTH.account = {
                    admin: false,
                    id: address,
                    name: address,
                    token: token,
                    friend_count: 0
                }

                return Promise.resolve({
                    success: true,
                    account: CONQUER.AUTH.account
                });
            } catch (error) {
                return Promise.resolve({
                    success: false,
                    account: error
                });
            }
        }
    }

    public async facebook(): Promise<any> {

        var self = this;

        return new Promise(async (resolve, reject) => {
            if (!this.vars.facebook) {
                await new Promise<void>((resolve, reject) => {

                    let facebookScript = document.createElement('script');
                    facebookScript.type = 'text/javascript';
                    facebookScript.src = 'https://connect.facebook.net/en_US/sdk.js';
                    facebookScript.async = true;
                    facebookScript.defer = true;

                    facebookScript.onload = () => {

                        let facebookAppId: string = `2303120786519319`;
                        FB.init({
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

            let loginStatus = await new Promise<fb.StatusResponse>((resolve, reject) => {
                FB.getLoginStatus((loginStatus) => {
                    // console.log(`loginStatus`, JSON.stringify(loginStatus, null, 4));
                    // statusChangeCallback(response);
                    resolve(loginStatus);
                });
            });

            let authResponse = loginStatus.authResponse;
            if (!authResponse) {
                authResponse = await new Promise<fb.AuthResponse>((resolve, reject) => {
                    FB.login((loginResponse: fb.StatusResponse) => {
                        resolve(loginResponse.authResponse);
                    }, { scope: 'public_profile,email,user_friends' });
                });
            }

            let fields: string[] = [
                'name',
                'email',
            ];

            let apiResponse1 = await new Promise<fb.StatusResponse>((resolve, reject) => {
                FB.api('/me', { fields: fields.join(', ') }, (apiResponse1: any) => {
                    resolve(apiResponse1);
                });
            });

            let apiResponse2 = await new Promise<fb.StatusResponse>((resolve, reject) => {
                FB.api('/me/friends', {}, (apiResponse2: any) => {
                    resolve(apiResponse2);
                });
            });

            let userInfo = apiResponse1 as any;
            let contactInfo = apiResponse2 as any;
            let token = await CONQUER.AUTH.tokenize(userInfo.email as string);

            CONQUER.AUTH.account = {
                admin: false,
                id: userInfo.email,
                name: userInfo.name,
                token: token,
                friend_count: contactInfo.summary.total_count
            }
            resolve({
                success: true,
                account: CONQUER.AUTH.account
            });
        });
    }

    public async oldUsername(params: { email: string, password: string }): Promise<any> {
        return new Promise(async (resolve) => {
            let url: URL = new URL(`${window.location.origin}${authLogin}`);
            let init: RequestInit = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: params.email,
                    password: params.password
                })
            };
            fetch(url, init)
                .then(res => res.json())
                .then((res: any) => {
                    // console.log(`login response: ${JSON.stringify(res)}`);
                    resolve({
                        success: res.success,
                        account: res.account,
                        error: res.error
                    });
                })
                .catch((error: any) => {
                    console.error(`error: ${error}`);
                });
        });
    }

    public async oldRegister(params: { email: string, password: string }): Promise<any> {
        return new Promise((resolve, reject) => {
            let url: URL = new URL(`${window.location.origin}${authRegister}`);
            let init: RequestInit = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: params.email,
                    password: params.password
                })
            };
            fetch(url, init)
                .then(res => res.json())
                .then((res: any) => {
                    resolve({
                        success: res.success,
                        error: res.error
                    });
                })
                .catch((error: any) => {
                    resolve({
                        success: false,
                        error: error.message
                    });
                });
        });
    }
}

namespace SOCIALAUTH {
}

export default SOCIALAUTH;