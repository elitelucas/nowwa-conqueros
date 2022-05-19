import express, { response } from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { load } from 'ts-dotenv';
import Environment from './Environment';
import crypto from 'crypto';

console.log(`project path: ${__dirname}`);

const envPath = path.resolve(__dirname, `../.env`);
console.log(`load .env from: ${envPath}`);
const env = load(Environment, {
    path: envPath,
    encoding: 'utf-8',
}); 

class Main {

    private port:number = 9001;

    private app:express.Express;

    private secret:string = "conqueros";

    constructor () {
        this.app = express();
        this.Initialize();
    }


    /**
     * Initialize necessary components.
     */
    private async Initialize () {
        console.log(`initialize...`);
        await this.InitExpress();
    }

    /**
     * Initialize express.
     */
    private async InitExpress ():Promise<void> {
        try {
            console.log(`init express...`);
    
            var self:Main = this;

            self.app
                .use(express.json())
                .use(express.urlencoded({
                    extended            :false
                }))
                .use(cors())
                .use(session({ 
                    genid               : () => crypto.randomBytes(48).toString('hex'),
                    secret              : self.secret,
                    resave              : true,
                    saveUninitialized   : true,
                    cookie              : {
                        maxAge          : (1000 * 60 * 100)
                    }
                }));

            self.ExpressGetDefault();
    
            console.log(`set port...`);
            self.app.listen(self.port);
            console.log(`listeneing on port ${self.port}`);
        }
        catch (error) {
            console.error(<Error>error);
        }
    }

    /**
     * Set express response for GET default '/' call.
     */
    private async ExpressGetDefault () {
        console.log(`set express get default...`);
    
        var self:Main = this;
    
        self.app.use('/', express.static(path.join(__dirname,'../public')));
    }

}

new Main();