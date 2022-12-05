import CONQUER from '../CONQUER';
import LOCALSTORAGE from '../UTILS/LOCALSTORAGE';

class AUTH 
{
    private vars: { [key: string]: any } = {};

    public async init() : Promise<any> 
    {
        LOCALSTORAGE.init();

        await this.get();

        return Promise.resolve();
    }

    public async login(type: string = "Guest"): Promise<any> 
    {
        this.vars.type = type;
    };

 
    public async set(vars: any): Promise<any> 
    {
        return CONQUER.do( "AUTH.set", vars);
    }
 
    public async guest(): Promise<any> 
    {
        return this.login("Guest");
    };

    public remove()
    {
        LOCALSTORAGE.removeAccount();
    }

    public async get( params?: { username: string, password: string, type:string }): Promise<any> 
    {
        if( params ) params.type = "USERNAME";
 
        let response : any = await CONQUER.do( "AUTH.get", params || LOCALSTORAGE.account );

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