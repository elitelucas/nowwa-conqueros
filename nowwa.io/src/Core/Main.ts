

import CONFIG from './CONFIG/CONFIG';

import Authentication from './DEPRECATED/Authentication';
import Database from './DEPRECATED/Database';
import Storage from './CMS/Storage';
import Build from './APPS/Build';

import Email from './DEPRECATED/Email';
import SOCKET from './SOCKET/SOCKET';
import CONQUER from '../Frontend/CONQUER';
import LOG, { log } from "../UTIL/LOG";
import AUTH from './USER/AUTH/AUTH';
import EMAIL from './USER/EMAIL';
import EXPRESS from './EXPRESS/EXPRESS';
import DATA from './DATA/DATA';

import dotenv from 'dotenv';
import FILE from './CMS/FILE';
import ACCOUNT from './TESTS/ACCOUNT';
import TEMPORARY from './TESTS/TEMPORARY';



class Main {
    /**
     * Initialize necessary components.
     */
    constructor() {
        this.init();
    }

    private async init(): Promise<void> {
        EXPRESS.init();

        // DEPRECATED

        await Authentication.AsyncInit();
        await Database.AsyncInit();
        await Email.AsyncInit();
        await Storage.AsyncInit();
        await Build.AsyncInit();

        // NEW CODE!

        await DATA.init();
        await AUTH.init();
        await EMAIL.init();
        await SOCKET.init();
        await FILE.init();

        // HACKIN

        dotenv.config();
        if (process.env.DISABLE_HACKING as string != 'true') {
            CONQUER.init();
        }
    }

}

export default Main;

var c: Main = new Main();

let test = async () => {
    await TEMPORARY.Init();
    let value = await ACCOUNT.Set({
        username: 'test2'
    });
    console.log(`value: ${JSON.stringify(value, null, 2)}`);
    let results1 = await ACCOUNT.Get({
        username: 'test1'
    });
    console.log(`results1: ${JSON.stringify(results1, null, 2)}`);
    let results2 = await ACCOUNT.Get({
        username: 'test2'
    });
    console.log(`results2: ${JSON.stringify(results2, null, 2)}`);
};

test();