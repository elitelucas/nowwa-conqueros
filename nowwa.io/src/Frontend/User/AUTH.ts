import CONQUER from '../CONQUER';

class AUTH {
    private vars: { [key: string]: any } = {};

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
 
    public async guest(): Promise<any> {

        return this.login("Guest");
    };

    public async logout(): Promise<any> {
        return CONQUER.WEBAUTH.SetSessionStorage({
            account: undefined
        });
    }

    public async get(params: { username: string, password: string }): Promise<any> {
        return CONQUER.do("AUTH.get", params);
    }

    public async register(params: { username: string, password: string }): Promise<any> {
        return CONQUER.do("AUTH.set", params);
    }

    public async tokenize(input: string): Promise<any> {
        return CONQUER.do("AUTH.tokenize", input);
    }
};

namespace AUTH {
}

export default AUTH;