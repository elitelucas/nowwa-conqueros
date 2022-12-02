import CONQUER from '../CONQUER';
import LOCALSTORAGE from '../UTILS/LOCALSTORAGE';

class AUTH 
{
    private vars: { [key: string]: any } = {};

    public async init(): Promise<any> 
    {
        /*
        Get session, from cookie?
        If session exists, login via backdoor?
        If session expired, log in as guest
        */

        LOCALSTORAGE.init();

        return Promise.resolve();
    }

    public async login(type: string = "Guest"): Promise<any> 
    {
        this.vars.type = type;
    };

 
    public async set(vars: any): Promise<any> 
    {
        return CONQUER.do("AUTH.set", vars);
    }
 
    public async guest(): Promise<any> 
    {
        return this.login("Guest");
    };

    public remove()
    {
        LOCALSTORAGE.removeAccount();
    }

    public async get( params: { username: string, password: string }): Promise<any> 
    {
        /*

        check storage (cookie)

        avatarID
        token
        firstName

        */


        let response : any = CONQUER.do("AUTH.get", params );

        /* 
        {
            success: boolean,
            result:{
                avatarID,
                firstName,
                token
            }
        }

        storage: account
        token 

        WEBAUTH.SessionStorage.Account.token = lalalala

        */

        LOCALSTORAGE.setAccount(
        {
            avatarID    : response.result.avatarID,
            token       : response.result.token
        });

        return response;
    }

    public async register(params: { username: string, password: string }): Promise<any> 
    {
        return CONQUER.do("AUTH.set", params);
    }
 
};

namespace AUTH {
}

export default AUTH;