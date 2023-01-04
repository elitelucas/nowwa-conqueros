import { debug } from 'console';
import LOG, { log } from '../../UTIL/LOG';
import CONQUER from '../CONQUER';

class User
{
    public avatarID?        : string;
    public firstName?       : string;
    public username?        : string;
    public token?           : string;
    public type?            : 'DISCORD' | 'FACEBOOK' | 'TWITTER' | 'GOOGLE' | 'SNAPCHAT' | 'CONQUER' | 'METAMASK' | 'GUEST' | 'USERNAME';
    public email?           : string;
    public accessToken?     : string;
    public wallet?          : string;
}

namespace User {
    export const Fields:string[] = [
        `avatarID`, `firstName`, `username`, `token`, `type`, `email`, `accessToken`, `wallet`
    ];
}

export default User;