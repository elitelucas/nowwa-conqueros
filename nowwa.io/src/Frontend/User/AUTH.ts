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

        // UserInstance.Friends.get();
    }

    public async getSet(vars: any): Promise<any> {

    }

    public async guest(): Promise<any> {

        return this.login("Guest");
    };

    public async logout(): Promise<any> {
        return CONQUER.SetSessionStorage({
            account: undefined
        });
    }

    public async username(params: { username: string, password: string }): Promise<any> {
        return CONQUER.do("AUTH.get", params);
    }

    /// CONQUER.AUTH.username( asdada ).then( {} );
    // SOCIAL AUTH 

    public async register(params: { username: string, password: string }): Promise<any> {
        return CONQUER.do("AUTH.set", params);
    }

    public async tokenize(input: string): Promise<any> {
        return CONQUER.do("AUTH.tokenize", input);
    }
};

namespace AUTH {

    export type Account = {
        id: string,
        token: string,
        name: string,
        admin: boolean,
        friend_count: number,
        source: 'DISCORD' | 'FACEBOOK' | 'TWITTER' | 'GOOGLE' | 'SNAPCHAT' | 'CONQUER' | 'METAMASK'
    }
}

export default AUTH;