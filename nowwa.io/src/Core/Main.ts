import express, { response } from 'express';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';
import mongoose from 'mongoose';
import session from 'express-session';
import crypto from 'crypto';
import multer from 'multer';
import cloudinary from 'cloudinary';
import path from 'path';
import { load } from 'ts-dotenv';
import User from './models/User';
import Environment from './Environment';

console.log(`project path: ${__dirname}`);

class Core {
    
    private port:number = 9000;

    private app:express.Express;

    private secret:string = "conqueros";

    private env:any;

    constructor () {
        this.app = express();
        this.InitEnvironment();
        this.InitExpress();
        this.InitAuthentication();
        this.InitDatabase();
        this.InitCloudinary();
    }

    /**
     * Initialize environment variables.
     */
    private async InitEnvironment ():Promise<void> {
        console.log(`init environment...`);
    
        var self:Core = this;
        
        var mode:string = '';
        console.log(process.env.mode);
        if (typeof process.env.mode != 'undefined') {
            mode = '.' + process.env.mode as string;
        }
        const envPath = path.resolve(__dirname, `../../.env${mode}`);
        console.log(`load .env from: ${envPath}`);
        self.env = load(Environment, {
            path: envPath,
            encoding: 'utf-8',
        }); 
    }

    /**
     * Initialize express.
     */
    private async InitExpress ():Promise<void> {
        try {
            console.log(`init express...`);
    
            var self:Core = this;

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
    
        var self:Core = this;
    
        self.app.use('/', express.static(path.join(__dirname,'../Front')));
        self.app.get('/', (req,res) => {
            res.sendFile(path.join(__dirname,'../Front/index.html'));
        });
    }

    /**
     * Set express response for POST '/authenticate' call.
     */
    private async ExpressPostAuthenticate () {
        console.log(`set express post authenticate...`);
    
        var self:Core = this;
    
        self.app.post('/authenticate', (req, res) => {
            console.log(`<-- request authenticate`);
            passport.authenticate('local', (error:Error, user?:any) => {
                if (error) {
                    return res.send({ success: false, error: error });
                }
                return res.send({ success: true, user: user });
            })(req, res);
        });

    }

    /**
     * Set express response for POST '/register' call.
     */
    private async ExpressPostRegister () {
        console.log(`set express post register...`);
    
        var self:Core = this;
    
        self.app.post('/register', (req:express.Request, res:express.Response) => {
            console.log(`<-- request register`);
            User.findOne({ username: req.body.username }, async (error:any, user?:any) => {
                if (error) { 
                    return res.send({ success: false, error: error });
                }
                if (user) { 
                    return res.send({ success: false, error: new Error("user already exists!") });
                }
                const newUser = new User({ username: req.body.username, password: req.body.password });
                await newUser.save();
                return res.send({ success: true, user: newUser });
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
    
        var self:Core = this;
        
        var storage = multer.diskStorage({ 
            destination: (req, file, callback) => {
                callback(null, `temp/`);
            },
            filename: (req, file, callback) => {
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
                console.log(`upload file to cloudinary...`);
                cloudinary.v2.uploader.upload(file.path, (error) => {
                    if (error) {
                        // The results in the web browser will be returned inform of plain text formart. We shall use the util that we required at the top of this code to do this.
                        res.send({ success: false, error: error });
                    }
                })
                .then(response => {
                    res.send({ 
                        success: true, 
                        message: 'file uploaded!',
                        response: response
                    });
                })
                .catch((error:Error) => {
                    res.send({ success: false, error: error });
                });
            } else {
                res.send({ success: false, error: new Error('file uploaded fails...') });
            }

        });
    }

    /**
     * Initialize database connection.
     */
    private async InitDatabase () {
        console.log(`init database...`);

        var self:Core = this;

        var uri:string = `mongodb+srv://${self.env.MONGODB_USER}:${self.env.MONGODB_PASS}@${self.env.MONGODB_HOST}/${self.env.MONGODB_DB}`;
        console.log(`connect to: ${uri}`);
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            sslValidate: false,
            sslCert: `${self.env.MONGODB_CERT}`
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
        .catch((error:Error) => {
            console.error("Connection error", error);
        });
    }

    /**
     * Initialize authentication using Core.
     */
    private InitAuthentication () {
        console.log(`init authentication...`);

        var self:Core = this;

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

    /**
     * Initialize Cloudinary usage.
     */
    private InitCloudinary () {
        console.log(`init cloudinary...`);

        var self:Core = this;

        console.log(`set cloudinary config...`);
        cloudinary.v2.config({
            cloud_name  : `${self.env.CLOUDINARY_NAME}`,
            api_key     : `${self.env.CLOUDINARY_KEY}`,
            api_secret  : `${self.env.CLOUDINARY_SECRET}`,
        });
    }

    /**
     * Create new model on database.
     */
    public CreateNewModel (rawFields:string, values:any) {

    }
}

var c:Core = new Core();