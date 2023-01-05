import { ACTIONS } from '../../Models/ENUM';
import CONQUER from '../CONQUER';
import Storage from '../UTILS/Storage';
import User from './User';

class Auth 
{
    private conquer: CONQUER;

    public constructor(instance:CONQUER) 
    {
        this.conquer = instance;
    }

    public async init() : Promise<any> 
    {
        if (typeof this.conquer.User != 'undefined' && 
        (
            this.conquer.User!.type == 'FACEBOOK' || 
            // this.conquer.User!.type == 'DISCORD' || 
            // this.conquer.User!.type == 'GOOGLE' || 
            // this.conquer.User!.type == 'TWITTER' || 
            // this.conquer.User!.type == 'SNAPCHAT' || 
            this.conquer.User!.type == 'WALLET' ||
        typeof this.conquer.User!.token != 'undefined')
        ) {
            await this.get();
        }

        return Promise.resolve();
    }
 
    public async set( params : { username: string, password: string } ) : Promise<any> 
    {
        return this.conquer.do( ACTIONS.AUTH_SET, params );  
    }

    public async logout()
    {
        if (typeof this.conquer.User != 'undefined' && this.conquer.User.type == 'FACEBOOK') {
            await new Promise<void>((resolve, reject) => {
                FB.logout((response:fb.StatusResponse) => {
                    resolve();
                });
            });
        }
        this.conquer.Storage.removeAccount();
        return Promise.resolve();
    }

    public async guest() 
    {
        let response = await this.get();
        return Promise.resolve(response);
    }

    public async get( params? : { username:string, password:string, type?: string } ): Promise<any> 
    {
        
        if( params ) params.type = "USERNAME";

        // console.log(`[Auth] get CONQUER.User`, this.conquer.User);
        // console.log(`[Auth] get params`, params);

        let parameter = typeof params != 'undefined' ? params : this.conquer.User;

        // console.log(`[Auth] get parameter`, parameter);
 
        let response : any = await this.conquer.do( ACTIONS.AUTH_GET, parameter );

        // console.log(`[Auth] get response`, response);

        if (typeof response != 'string') {
            
            // console.log(`[Auth] get typeof response`, typeof response);
            this.conquer.Storage.setAccount(response);

            this.conquer.Analytics.onEntryPoint();

        }

        return Promise.resolve(response);
    }
 
};


export default Auth;