import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

let Compile = async (): Promise<void> => {

    try {
        const argv: any = yargs(hideBin(process.argv)).argv;
        const env = argv.env;

        let commands: string[] = [];
        if (env == 'dev') {
            commands.push(`npx tsc-watch --onSuccess "node ./dist/Core/Main.js`);
            commands.push(`parcel watch ./src/Pages/Index.html --dist-dir ./storage --no-content-hash`);
        } else if (env == 'prod') {
            commands.push(`npx tsc`);
            commands.push(`parcel build ./src/Pages/Index.html --dist-dir ./storage`);
            commands.push(`forever restartall`);
        }
        let childs: ChildProcessWithoutNullStreams[] = [];
        for (let i: number = 0; i < commands.length; i++) {
            let command: string = commands[i];
            console.log(`spawn: ${command}`);
            let task = spawn(command, { shell: true, windowsHide: false });
            childs.push(task);
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
                    if (env == 'prod') {
                        resolve();
                    }
                });
                if (env == 'dev') {
                    resolve();
                }
            });
        }

        console.log(`=== success ===`);
    } catch (err) {
        console.log(`=== error ===`);
        console.log(`${err}`);
    }
};

Compile();