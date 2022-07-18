import TscWatchClient from 'tsc-watch/client';
import copyfiles from 'copyfiles';
import ChildProcess from 'child_process';

const watch = new TscWatchClient();

watch.on('compile_errors', () => {
    console.log('compile errors');
});

watch.on('first_success', () => {
    console.log('compile first_success');
});

watch.on('success', () => {
    console.log('Compilation started');
    copyfiles([`./src/Pages/*.html`, `./dist/`], { up: 1 }, (error) => {
        if (error) {
            console.log(`error`, error);
        }
    });
    console.log('watch Parcel...');
    ChildProcess.exec(`parcel watch ./src/Pages/Index.tsx`);
    console.log('run Main.js...');
    ChildProcess.fork('./dist/Core/Main.js');
});

try {
    // do something...
} catch (e) {
    watch.kill(); // Fatal error, kill the compiler instance.
}

watch.start('--project', '.');