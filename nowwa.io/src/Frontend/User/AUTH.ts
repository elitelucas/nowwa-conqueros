import CONQUER from '../CONQUER';
import LocalStorage from '../UTILS/LocalStorage';

class Auth 
{
    private vars: { [key: string]: any } = {};

    public async init() : Promise<any> 
    {
        LocalStorage.init();

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
        LocalStorage.removeAccount();
    }

    public async get( params?: { username: string, password: string, type?:string }): Promise<any> 
    {
        if( params ) params.type = "USERNAME";
 
        let response : any = await CONQUER.do( "AUTH.get", params || LocalStorage.account );
 
        LocalStorage.setAccount(
        {
            avatarID    : response.result.avatarID,
            token       : response.result.token,
            firstName   : response.result.firstName,
            admin       : response.result.admin,
            username    : response.result.username
        });

        return response;
    }

    public async register(params: { username: string, password: string }): Promise<any> 
    {
        return CONQUER.do("AUTH.set", params);
    }
 
};

namespace Auth {
}

export default Auth;