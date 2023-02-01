import express from "express";
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

class Main {
    /**
     * Initialize necessary components.
     */
    constructor() {
        var app: express.Express = 
            express()
            .use(express.json())
            .use(express.urlencoded({
                extended: false
            }));

        app.use('/test', (req, res) => {
            console.log(`[Express] /test/`);
            res.status(200).send('test');
        });

        app.use('/pull', (req, res) => {
            console.log(`[Express] /pull/`);
            res.status(200).send('pull');
            this.pull();
        });

        app.listen(9900);
    }
    
    async pull (): Promise<void> {

        try {
            let command:string = `cd $HOME/conqueros && git pull && cd nowwa.io && npm run prod`;
            let task = spawn(command, { shell: true, windowsHide: false });
            await new Promise<void>((resolve, reject) => {
                task.stdout.on('data', (data) => {
                    console.log(`= stdout =`);
                    console.log(`${data}`);
                });
                task.stderr.on('data', (data) => {
                    console.log(`= stderr =`);
                    console.log(`${data}`);
                });
                task.on('exit', (code) => {
                    console.log(`code: ${code}`);
                    resolve();
                });
            });
            console.log(`=== success ===`);
        } catch (err) {
            console.log(`=== error ===`);
            console.log(`${err}`);
        }
    }
}

export default Main;

var c: Main = new Main();