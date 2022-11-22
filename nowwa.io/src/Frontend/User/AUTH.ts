import { authLinks, authLogin, authRegister, authTokenize, authVerify } from '../../Core/CONFIG/CONFIG';
import CONQUER from '../CONQUER';

class AUTH {
    private vars: { [key: string]: any } = {};

    public account?: AUTH.Account;

    public async init(): Promise<any> 
    {
        /*
        Get session, from cookie?
        If session exists, login via backdoor?
        If session expired, log in as guest
        */

        var guestUsername: string = "guest123";

        return Promise.resolve();
    }

    public async login(type: string = "Guest"): Promise<any> {
        this.vars.type = type;
    };

 
    public async set(vars: any): Promise<any> 
    {
        return CONQUER.do("AUTH.set", vars);
    }

    public async get(vars: any): Promise<any> 
    {
        return CONQUER.do("AUTH.get", vars);
    }

    public async getSet(vars: any): Promise<any> {

    }

    public async guest(): Promise<any> {

        return this.login("Guest");
    };

    public async username(params: { username: string, password: string }): Promise<any> {
        return CONQUER.do("AUTH.get", params);
    }

    public async register(params: { username: string, password: string }): Promise<any> {
        return CONQUER.do("AUTH.set", params);
    }

    public async tokenize(input: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let url: URL = new URL(`${window.location.origin}${authTokenize}`);
            let init: RequestInit = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: input
                })
            };
            fetch(url, init)
                .then(res => res.json())
                .then((res: any) => {
                    // console.log(`login response: ${JSON.stringify(res)}`);
                    if (res.success) {
                        resolve(res.value);
                    } else {
                        reject(res.error);
                    }
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }
};

namespace AUTH {

    export type Account = {
        id: string,
        token: string,
        name: string,
        admin: boolean,
        friend_count: number
    }
}

export default AUTH;