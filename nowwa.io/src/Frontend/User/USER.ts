import LOG, { log } from '../../UTIL/LOG';
import CONQUER from '../CONQUER';
 
class User 
{
    public avatarID     : any = null;
    public firstName    : any = null;
    public username     : any = null;
    public token        : any = null;
 
    public set( params:any )
    {
        if( !params ) return;

        this.avatarID   = params.avatarID;
        this.firstName  = params.firstName;
        this.username   = params.username;
        this.token      = params.token;

        CONQUER.LocalStorage.setAccount( params );
    }

 

};

export default User;