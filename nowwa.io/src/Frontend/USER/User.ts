import { debug } from 'console';
import LOG, { log } from '../../UTIL/LOG';
import CONQUER from '../CONQUER';

class User
{
    public avatarID?        : string;
    public firstName?       : string;
    public username?        : string;
    public token?           : string;
    public type?            : string;
}

namespace User {
    export const Fields:string[] = [
        `avatarID`, `firstName`, `username`, `token`
    ];
}

export default User;