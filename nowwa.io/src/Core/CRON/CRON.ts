import { cronRun } from "../CONFIG/CONFIG";
import EXPRESS from "../EXPRESS/EXPRESS";
import cron from 'node-cron';

class CRON {

    public static async init (): Promise<void> {

        console.log( 'running a task every second-0 minute-0 hourly' );
        cron.schedule( '0 0 * * * *', () => {

        } );

        this.webhookRunCron();

        return Promise.resolve();
    }

    private static webhookRunCron () {
        EXPRESS.app.use( `${ cronRun }`, async ( req, res ) => {
            await CRON.run();
            res.status( 200 ).send( {
                success: true
            } );
        } );
    }

    private static async run() {

        let now = new Date();
        console.log(`[CRON] run: ${now.toUTCString()}`);

        return Promise.resolve();
    }
}

namespace CRON {

}

export default CRON;