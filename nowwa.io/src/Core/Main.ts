 
 
import CONFIG from './CONFIG/CONFIG';
import Status from './APPS/Status';

import Authentication from './DEPRECATED/Authentication';
import Database from './DEPRECATED/Database';
import Storage from './CMS/Storage';
import Build from './APPS/Build';

import Email from './DEPRECATED/Email';
import Twitter from './USER/AUTH/Twitter';
import SOCKET from './SOCKET/SOCKET';
import CONQUER from '../Frontend/CONQUER';
import LOG, { log } from "../UTIL/LOG";
import AUTH from './USER/AUTH/AUTH';
import EMAIL from './USER/EMAIL';
import Snapchat from './USER/AUTH/Snapchat';
import Discord from './USER/AUTH/Discord';
import EXPRESS from './EXPRESS/EXPRESS';
import DATA from './DATA/DATA';

console.log(`project path: ${__dirname}`);

class Main 
{
    /**
     * Initialize necessary components.
     */
    constructor() 
    {
        this.init();
    }

    private async init(): Promise<void> 
    {
        CONFIG.init();
        EXPRESS.init();

        // TODO : enable authentication & database
        await Authentication.AsyncInit();

        await Database.AsyncInit();
        await Email.AsyncInit();
        
        await Twitter.AsyncInit();
        await Snapchat.AsyncInit();
        await Discord.AsyncInit();

        await Storage.AsyncInit();
        await Build.AsyncInit();

        // NEW CODE!

        await DATA.init();
        await AUTH.init();
        await EMAIL.init();
        await SOCKET.init();

        // HACKIN

        CONQUER.init();

        // await Email.Send('garibaldy.mukti@gmail.com', 'The Subject of This Email', 'The content of this email');
  
    }


}

namespace Main 
{
    export type Status = 
    {
        Builder: Status.Detail,
        requestCount: number,
    }

    export const StatusDefault: Status = 
    {
        Builder: Status.CurrentStatus,
        requestCount: 0,
    }
}

export default Main;

var c: Main = new Main();