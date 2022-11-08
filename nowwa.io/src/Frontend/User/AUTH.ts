import LOG, { log } from '../../UTIL/LOG';
 
import CONQUER from '../CONQUER';


class AUTH 
{
    private vars : any = {};

    public async init(): Promise<any> 
    {
        return Promise.resolve();
    }

    private async login( type:string="Guest" ) : Promise<any>
    {
        this.vars.type   = type;
    };

    public async set( vars:any ) : Promise<any>
    {

    }

    public async get( vars:any ) : Promise<any>
    {

    }

    public async getSet( vars:any ) : Promise<any>
    {

    }

    public async guest() : Promise<any> 
    {
        
        return this.login( "Guest" );
    };

    public async discord() : Promise<any>
    {
        return new Promise( async (resolve) => 
        {
            // Do form stuff
            await this.login( "Discord" );
            resolve( true );
        });
    }

    public async twitter() : Promise<any>
    {
        return new Promise( async (resolve) => 
        {
            // Do form stuff
            await this.login( "Twitter" );
            resolve( true );
        });
    };

    public async snapchat() : Promise<any>
    {
        return new Promise( async (resolve) => 
        {
            // Do form stuff
            await this.login( "Snapchat" );
            resolve( true );
        });
    };
 
    public async google() : Promise<any>
    {
        return new Promise( async (resolve) => 
        {
            // Do form stuff
            await this.login( "Google" );
            resolve( true );
        });
    } 

    public async username() : Promise<any>
    {
        return new Promise( async (resolve) => 
        {
            // Do form stuff
            await this.login( "Google" );
            resolve( true );
        });
    } 
};

export default AUTH;