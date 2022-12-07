import CONQUER from '../CONQUER';
import Storage from '../UTILS/Storage';

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
        return CONQUER.do( "AUTH.set", params );
    }
 
    public async guest(): Promise<any> 
    {
        return this.login("Guest");
    }

    public remove()
    {
        CONQUER.Storage.removeAccount();
    }

    public async get( params? : { username: string, password: string, type?:string }): Promise<any> 
    {
        if( params ) params.type = "USERNAME";
 
        let response : any = await CONQUER.do( "AUTH.get", params || CONQUER.Storage.account );

        CONQUER.User.set( response.result );

        return response;
    }
 
};


export default Auth;