import { authLinks, authVerify } from '../../Core/CONFIG/CONFIG';
import LOG, { log } from '../../UTIL/LOG';
import CONQUER from '../CONQUER';

type Account = {
    id: string,
    token: string,
    name: string,
    admin: boolean,
    friend_count: number
}

class AUTH {
    private vars: { [key: string]: any } & {
        twitter?: string,
        discord?: string,
        google?: string,
        snapchat?: string,
        facebook?: string
    } = {};

    public account?: Account;

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
        let params = CONQUER.SearchParams;

        if (params.source) {

            log(`[${params.source}] verifying user...`);
            let authVerifyResponse = await new Promise<any>((resolve, reject) => {
                let authVerifyUrl: URL = new URL(`${window.location.origin}${authVerify}`);
                let authVerifyRequest: RequestInit = {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
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
                    this.account = {
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
        this.vars.facebook = authLinkResponse.facebook;
    }

    private async login(type: string = "Guest"): Promise<any> {
        this.vars.type = type;
    };

    public async set(vars: any): Promise<any> {
        return CONQUER.do("AUTH.set", vars);
    }

    public async get(vars: any): Promise<any> {
        return CONQUER.do("AUTH.get", vars);
    }

    public async getSet(vars: any): Promise<any> {

    }

    public async guest(): Promise<any> {

        return this.login("Guest");
    };

    public async discord(): Promise<any> {
        window.open(this.vars.discord, "_self");
        // return new Promise(async (resolve) => {
        //     // Do form stuff
        //     await this.login("Discord");
        //     resolve(true);
        // });
    }

    public async twitter(): Promise<any> {
        window.open(this.vars.twitter, "_self");
        // return new Promise(async (resolve) => {
        //     // Do form stuff
        //     await this.login("Twitter");
        //     resolve(true);
        // });
    };

    public async snapchat(): Promise<any> {
        window.open(this.vars.snapchat, "_self");
        // return new Promise(async (resolve) => {
        //     // Do form stuff
        //     await this.login("Snapchat");
        //     resolve(true);
        // });
    };

    public async google(): Promise<any> {
        window.open(this.vars.google, "_self");
        // return new Promise(async (resolve) => {
        //     // Do form stuff
        //     await this.login("Google");
        //     resolve(true);
        // });
    }

    public async username(): Promise<any> {
        return new Promise(async (resolve) => {
            // Do form stuff
            await this.login("Google");
            resolve(true);
        });
    }
};

export default AUTH;