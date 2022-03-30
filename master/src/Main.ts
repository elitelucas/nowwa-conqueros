import express from 'express';
import open from 'open';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';
import mongoose from 'mongoose';
import Config from './Config';
import User from './models/User';
import session from 'express-session';
import crypto from 'crypto';
import multer from 'multer';
import cloudinary from 'cloudinary';

const environment:string = process.env.NODE_ENV as string;

class PassportJS {
    
    private port:number = 9876;

    private app:express.Express;

    private secret:string = "conqueros";

    constructor () {
        this.app = express();
        this.InitExpress();
        this.InitAuthentication();
        this.InitDatabase();
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

            self.ExpressGetDefault();
            self.ExpressPostAuthenticate();
            self.ExpressPostRegister();
            self.ExpressPostUpload();
    
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
    private async ExpressGetDefault () {
        console.log(`set express get default...`);
    
        var self:PassportJS = this;
    
        self.app.get('/', (req, res) => {
            console.log(`<-- request default`);
            self.SendResponse(res, null, { message: 'response default'});
        });

    }

    /**
     * Set express response for POST '/authenticate' call.
     */
    private async ExpressPostAuthenticate () {
        console.log(`set express post authenticate...`);
    
        var self:PassportJS = this;
    
        self.app.post('/authenticate', (req, res) => {
            console.log(`<-- request authenticate`);
            passport.authenticate('local', (error:Error, user?:any) => {
                return self.SendResponse(res,error,user);
            })(req, res);
        });

    }

    /**
     * Set express response for POST '/register' call.
     */
    private async ExpressPostRegister () {
        console.log(`set express post register...`);
    
        var self:PassportJS = this;
    
        self.app.post('/register', (req:express.Request, res:express.Response) => {
            console.log(`<-- request register`);
            User.findOne({ username: req.body.username }, async (error:any, user?:any) => {
                if (error) { return self.SendResponse(res, error); }
                if (user) { return self.SendResponse(res, new Error("user already exists!")); }
                const newUser = new User({ username: req.body.username, password: req.body.password });
                await newUser.save();
                return self.SendResponse(res, null, newUser);
                /*
                User.reg(newUser, req.body.password, (error:any, user?:any) => {
                    if (error) { return self.SendResponse(res, error); }
                });
                */
            });
        });
    }

    /**
     * Set express response for POST '/upload' call.
     */
    private async ExpressPostUpload () {
        console.log(`set express post upload...`);
    
        var self:PassportJS = this;
        
        var storage = multer.diskStorage({ 
            destination: function (req, file, callback) {
                callback(null, `temp/`);
            },
            filename: function (req, file, callback) {
                /*
                var extensionRegex:RegExp = /[^.]+$/i;
                var extension = file.originalname.match(extensionRegex);
                if (extension != null) {
                    var extensionName = extension[0];
                    var fieldName:string = file.fieldname;
                    callback(null, `${fieldName}.${extensionName}`);
                }
                callback(null, `${fieldName}.${extensionName}`);
                */
                callback(null, file.originalname);
            }
        });

        var upload = multer({ storage: storage });
    
        self.app.post('/upload', upload.single('fld_file'), (req, res) => {
            console.log(`<-- request upload`);

            var file:Express.Multer.File | undefined = req.file;

            if (typeof (file) != `undefined`) {
                console.log(`set cloudinary config...`);
                cloudinary.v2.config(Config.Cloudinary);
                console.log(`upload file to cloudinary...`);
                cloudinary.v2.uploader.upload(file.path, result => {
    
                    // This will return the output after the code is exercuted both in the terminal and web browser
                    // When successful, the output will consist of the metadata of the uploaded file one after the other. These include the name, type, size and many more.
                    console.log(`get result from cloudinary...`);
                    console.log(typeof (result));
                    if (typeof (result) != `undefined`) {
                        // The results in the web browser will be returned inform of plain text formart. We shall use the util that we required at the top of this code to do this.
                        return self.SendResponse(res, null, { message: 'file uploaded!'});
                    }
                    return self.SendResponse(res, null, { message: 'file uploaded 2!'});
                });
            } else {
                return self.SendResponse(res, null, { message: 'file uploaded fails...'});
            }

        });
    }

    /**
     * Initialize database connection.
     */
    private async InitDatabase () {
        console.log(`init database...`);

        var self:PassportJS = this;

        var uri:string = `mongodb+srv://${Config.Database.USER}:${Config.Database.PASS}@${Config.Database.HOST}/${Config.Database.DB}`;
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
            /*
            (async () => {
                var indexes = await User.listIndexes();
                console.log(JSON.stringify(indexes)); 
                await User.deleteMany({});
                console.log('success');
                //mongoose.connection.deleteModel('Users')
            })();
            */
        })
        .catch((e) => {
            console.error("Connection error", e);
        });
    }

    /**
     * Initialize authentication using PassportJS.
     */
    private InitAuthentication () {
        console.log(`init authentication...`);

        var self:PassportJS = this;

        passport.use(new passportLocal.Strategy({
            passwordField: "password",
            usernameField: "username"
        },(username,password,done)=>{
            User.findOne({ username: username }, async (error:Error, user?:any) => {
                if (error) { return done(error); }
                if (!user) { return done(new Error("user does not exists"), false); }
                user.verifyPassword(password, (error:Error, isMatch:boolean) => {
                    if (error) { return done(error); }
                    if (!isMatch) { return done(new Error("incorrect password"), false); }
                    return done(null, user);
                });
            });
        }));
    }

    private SendResponse (res:express.Response, error:Error | null, value?:any) {
        res.send({
            error: error?.message,
            value: value
        });
    }
}

new PassportJS();