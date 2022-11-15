import LOG, { log } from '../../UTIL/LOG';
import CONQUER from '../CONQUER';


class AUTH 
{
    private vars : any = {};

    public async init(): Promise<any> 
    {
        /*
        Get session, from cookie?
        If session exists, login via backdoor?
        If session expired, log in as guest
        */

        var guestUsername : string = "guest123";
 

        return Promise.resolve();
    }

    private async login( type:string="Guest" ) : Promise<any>
    {
        this.vars.type   = type;
    };

    public async set( vars:any ) : Promise<any>
    {
        return CONQUER.do( "AUTH.set", vars );
    }

    public async get( vars:any ) : Promise<any>
    {
        return CONQUER.do( "AUTH.get", vars );
    }

    public async remove( vars:any ) : Promise<any>
    {
        //return CONQUER.do( "AUTH.remove", vars );
    
        return Promise.resolve();
    }

    public async getSet( vars:any ) : Promise<any>
    {

    }

    public async guest() : Promise<any> 
    {
        
        return this.login( "Guest" );
    };
 
    public discord()
    {
 
    }

    public async twitter()
    {

    };

    public snapchat()
    {

    };
 
    public google()
    {
 
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