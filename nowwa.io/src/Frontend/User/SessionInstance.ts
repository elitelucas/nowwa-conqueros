import LOG, { log } from '../../UTIL/LOG';
import PROMISE, { resolve } from '../../UTIL/PROMISE';
import CONQUER from '../CONQUER';


class SessionInstance {
    public async init(cos: CONQUER): Promise<any> {
        return Promise.resolve();
    }
};

export default SessionInstance;