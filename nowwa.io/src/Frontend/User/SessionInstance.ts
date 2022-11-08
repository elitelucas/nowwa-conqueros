import LOG, { log } from '../../UTIL/LOG';
import PROMISE, { resolve } from '../../UTIL/PROMISE';
import COS from '../ConquerOS';
 

class SessionInstance 
{
    private Conquer : COS;

    public async init( cos:COS ) : Promise<any>
    {
        this.Conquer = cos;

        return resolve();
    }
};

export default SessionInstance;