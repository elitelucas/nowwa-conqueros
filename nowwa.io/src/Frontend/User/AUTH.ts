import { socialAuthLinks } from '../../Core/CONFIG/CONFIG';
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
        await this.social();

        var guestUsername: string = "guest123";


        return Promise.resolve();
    }

    private async redirect(): Promise<void> {
        let params = CONQUER.SearchParams;
        if (params.source) {
            // TODO : check if token is valid 
            if (params.source == 'twitter') {
                this.account = {
                    admin: params.admin as string == 'true',
                    id: params.id,
                    name: params.name,
                    token: params.token,
                    friend_count: parseInt(params.friend_count as string || "0")
                }
                return Promise.resolve();
            }
        }
        return Promise.resolve();
    }

    private async social(): Promise<void> {

        let socialAuthLinkResponse = await new Promise<any>((resolve, reject) => {
            let socialAuthLinksUrl: URL = new URL(`${window.location.origin}${socialAuthLinks}`);
            let socialAuthLinksRequest: RequestInit = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: '{}'
            };
            fetch(socialAuthLinksUrl, socialAuthLinksRequest)
                .then(socialAuthLinkResponse => socialAuthLinkResponse.json())
                .then((socialAuthLinkResponse: any) => {
                    resolve(socialAuthLinkResponse);
                })
                .catch((error: any) => {
                    console.error(`error: ${error}`);
                    reject(error);
                });

        });
        this.vars.twitter = socialAuthLinkResponse.twitter;
        this.vars.discord = socialAuthLinkResponse.discord;
        this.vars.google = socialAuthLinkResponse.google;
        this.vars.snapchat = socialAuthLinkResponse.snapchat;
        this.vars.facebook = socialAuthLinkResponse.facebook;
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
        return new Promise(async (resolve) => {
            // Do form stuff
            await this.login("Discord");
            resolve(true);
        });
    }

    public async twitter(): Promise<any> {
        window.open(this.vars.twitter, "_self");
        return new Promise(async (resolve) => {
            // Do form stuff
            await this.login("Twitter");
            resolve(true);
        });
    };

    public async snapchat(): Promise<any> {
        return new Promise(async (resolve) => {
            // Do form stuff
            await this.login("Snapchat");
            resolve(true);
        });
    };

    public async google(): Promise<any> {
        return new Promise(async (resolve) => {
            // Do form stuff
            await this.login("Google");
            resolve(true);
        });
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