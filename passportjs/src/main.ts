import express from 'express';
import open from 'open';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';
import mongoose from 'mongoose';
import { dbConfig } from './configs/DB.config';
import User from './models/User';
import session from 'express-session';
import crypto from 'crypto';

const environment:string = process.env.NODE_ENV as string;

class PassportJS {
    
    private port:number = 9876;

    private app:express.Express;

    private secret:string = "conqueros";

    constructor () {
        this.app = express();
        this.InitExpress();
        this.InitPassport();
        this.InitMongoose();
        if (environment == 'development') {
            open(`http://localhost:${this.port}/test`);
        }
    }

    /**
     * Initialize express.
     */
    private async InitExpress ():Promise<void> {
        try {
            console.log(`init express...`);
    
            var self:PassportJS = this;

            console.log('set parser...'); 
            self.app.use(express.json());
            self.app.use(express.urlencoded({extended:false}));
            self.app.use(session({ 
                genid               : () => crypto.randomBytes(48).toString('hex'),
                secret              : self.secret,
                resave              : true,
                saveUninitialized   : true,
                cookie              : {
                    maxAge          : (1000 * 60 * 100)
                }
            })); 
            self.app.use(passport.initialize());
            self.app.use(passport.session());

            console.log('set cors...'); 
            self.app.use(cors());

            if (environment == 'development') {
                console.log(`set static express...`);
                self.app.use('/test', express.static('test'));
            }

            self.ExpressGetDefault(self.app);
            self.ExpressPostPassportLocal(self.app);
    
            console.log(`set port...`);
            self.app.listen(self.port);
            console.log(`listeneing on port ${self.port}`);
        }
        catch (e) {
            console.error(e);
        }
    }

    /**
     * Set express response for GET default '/' call.
     */
    private async ExpressGetDefault (app:express.Express) {
        console.log(`set get express default...`);
    
        app.get('/', (req, res) => {
            console.log(`request default`);
            res.send('response default');
        });

    }

    /**
     * Set express response for POST '/passport-local' call.
     */
    private async ExpressPostPassportLocal (app:express.Express) {
        console.log(`set express passsport local...`);
    
        app.post('/passport-local', (req, res) => {
            //var params = req.body;
            // var key = params.key;
            // res.send(`got key: ${key}`);
            //res.send('response default');
            console.log(`request passport local`);
            passport.authenticate('local', (err:Error, user?:any) => {
                if (err) {
                    res.send(err.message);
                } else {
                    res.send(JSON.stringify(user));
                }
            })(req, res);
        });

    }

    /**
     * Initialize MongoDB connection.
     */
    private async InitMongoose () {
        console.log(`init mongoose...`);

        var self:PassportJS = this;

        var uri:string = `mongodb+srv://${dbConfig.USER}:${dbConfig.PASS}@${dbConfig.HOST}/${dbConfig.DB}`;
        console.log(`connect to: ${uri}`);
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            sslValidate: false,
            sslCert: `${__dirname}/../credentials/db.ca-certificate.crt`
        })
        .then(() => {
            console.log("Successfully connect to MongoDB.");
        })
        .catch((e) => {
            console.error("Connection error", e);
        });
    }

    /**
     * Initialize PassportJS for local authentication.
     */
    private InitPassport () {
        console.log(`init passsport...`);

        var self:PassportJS = this;
        
        passport.use(User.createStrategy());

        passport.use(new passportLocal.Strategy({
            passwordField: "password",
            usernameField: "username"
        },(username,password,done)=>{
            User.findOne({ username: username }, (err:any, user:any) => {
                if (err) { return done(err); }
                if (!user) { return done(new Error("user does not exists"), false); }
                if (!user.verifyPassword(password)) { return done(new Error("incorrect password"), false); }
                return done(null, user);
            });
            /*
            if (!username) {
                return done(new Error("unindentified username"));
            }
            if (!password) {
                return done(new Error("unindentified password"));
            }
            console.log(`username: ${username}`);
            console.log(`password: ${password}`);
            done(null, {
                username: username,
                password: password
            })
            */
        }));
    }
}

new PassportJS();