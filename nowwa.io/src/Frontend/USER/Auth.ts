import { ACTIONS } from '../../Models/ENUM';
import CONQUER from '../CONQUER';
import Storage from '../UTILS/Storage';

class Auth 
{
    private conquer: CONQUER;

    public constructor(instance:CONQUER) 
    {
        this.conquer = instance;
    }

    private vars: { [key: string]: any } = {};

    public async init() : Promise<any> 
    {

        console.log('auth initializing...');
        await this.get();

        console.log('auth initialized!');
        return Promise.resolve();
    }
 
    public async set( params : { username: string, password: string } ) : Promise<any> 
    {
        return this.conquer.do( ACTIONS.AUTH_SET, params );  
    }

    public async logout()
    {
        this.conquer.Storage.removeAccount();
        await this.get();
        return Promise.resolve();
    }

    public async get( params? : { username: string, password: string, type?:string }): Promise<any> 
    {

        console.log(`params`, params);
        
        if( params ) params.type = "USERNAME";

        console.log(`[Auth] get CONQUER.Storage.account`, this.conquer.Storage.account);
 
        let response : any = await this.conquer.do( ACTIONS.AUTH_GET, params || this.conquer.Storage.account );

        console.log(`[Auth] get response`, response);

        this.conquer.User.set( response );

        this.conquer.Analytics.onEntryPoint();

        return Promise.resolve(response);
    }
 
};


export default Auth;