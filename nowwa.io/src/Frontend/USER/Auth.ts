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
 
    public async set( params : { username: string, password: string } ) : Promise<any> 
    {
        return CONQUER.do( "AUTH.set", params );
    }

    public async logout()
    {
        CONQUER.Storage.removeAccount();
        await this.get();
        return Promise.resolve();
    }

    public async get( params? : { username: string, password: string, type?:string }): Promise<any> 
    {
        if( params ) params.type = "USERNAME";
 
        let response : any = await CONQUER.do( "AUTH.get", params || CONQUER.Storage.account );

        console.log(`response`, response);

        CONQUER.User.set( response.result );

        return Promise.resolve(response);
    }
 
};


export default Auth;