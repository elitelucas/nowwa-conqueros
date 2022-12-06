import CONQUER from '../CONQUER';
import LocalStorage from '../UTILS/LocalStorage';

class Auth 
{
    private vars: { [key: string]: any } = {};

    public async init() : Promise<any> 
    {
        await this.get();

        return Promise.resolve();
    }

    public async login(type: string = "Guest"): Promise<any> 
    {
        this.vars.type = type;
    }
 
    public async set( params : { username: string, password: string } ) : Promise<any> 
    {
        return CONQUER.do( "AUTH.set", params);
    }
 
    public async guest(): Promise<any> 
    {
        return this.login("Guest");
    }

    public remove()
    {
        CONQUER.LocalStorage.removeAccount();
    }

    public async get( params? : { username: string, password: string, type?:string }): Promise<any> 
    {
        if( params ) params.type = "USERNAME";
 
        let response : any = await CONQUER.do( "AUTH.get", params || CONQUER.LocalStorage.account );

        CONQUER.User.set( response.result );
 
        return response;
    }
 
};

namespace Auth {

}

export default Auth;