import express from 'express';

class PassportJS {

    app:express.Express;

    constructor () {
        this.app = express();
        this.start();
    }

    private start () {
        console.log(`start express...`);

        var port:number = 9876;
        this.app.get('/', (req, res) => {
            console.log('got request');
            res.send('hello worldz');
        });

        this.app.listen(port);
        console.log(`listeneing on port ${port}`);
    }

}

new PassportJS();