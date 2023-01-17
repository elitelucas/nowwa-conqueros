import express, { response } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import session from 'express-session';
import path from 'path';

console.log(`project path: ${__dirname}`);

class Main {

    private port: number = 9006;

    /**
     * Initialize necessary components.
     */
    constructor() {
        this.AsyncInit();
    }

    private async AsyncInit(): Promise<void> {
        try {
            console.log(`init express analytics...`);

            var self: Main = this;

            var app: express.Express =
                express()
                    .use(express.json())
                    .use(express.urlencoded({
                        extended: false
                    }))
                    .use(cors())
                    .use(session({
                        genid: () => crypto.randomBytes(48).toString('hex'),
                        secret: 'supersnappy.io',
                        resave: true,
                        saveUninitialized: true,
                        cookie: {
                            maxAge: (1000 * 60 * 100)
                        }
                    }))
                    .use((req, res, next) => {
                        // console.log(`req.url: ${req.url}`);
                        var adjustedUrl = req.url;
                        if (adjustedUrl.indexOf('//') == 0) {
                            adjustedUrl = adjustedUrl.slice(1);
                        }
                        if (!adjustedUrl.match(/\.[a-zA-Z0-9_\-]+$/g) && (adjustedUrl[adjustedUrl.length - 1] != '/')) {
                            req.url = `${adjustedUrl}/`;
                        }
                        next();
                    });

            app.all('/', (req, res, next) => {
                req.url = req.url + 'index.html';
                next();
            });

            let rootPath: string = path.join(__dirname, `..`, `public`);
            app.use('/', express.static(rootPath));

            app.listen(this.port);
            console.log(`[Express] listening on port ${this.port}`);
        }
        catch (error) {
            console.error(error);
        }
    }

}

namespace Main {
}

export default Main;

var c: Main = new Main();