import express, { response } from 'express';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';
import mongoose from 'mongoose';
import session from 'express-session';
import multer from 'multer';
import cloudinary from 'cloudinary';
import path from 'path';
import { load } from 'ts-dotenv';
import User from './Models/User';
import Environment from './Environment';
import CustomSchema from './Types/CustomSchema';
import crypto from 'crypto';

console.log(`project path: ${__dirname}`);

const envPath = path.resolve(__dirname, `../../.env`);
console.log(`load .env from: ${envPath}`);
const env = load(Environment, {
    path: envPath,
    encoding: 'utf-8',
}); 

class Core {
    
    private port:number = 9000;

    private app:express.Express;

    private secret:string = "conqueros";

    private env:any;

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
        await this.InitDatabase();
        this.InitCloudinary();
    }

    /**
     * Initialize express.
     */
    private async InitExpress ():Promise<void> {
        try {
            console.log(`init express...`);
    
            var self:Core = this;

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
                }))
                .use(passport.initialize())
                .use(passport.session());

            self.InitAuthentication();

            self.ExpressGetDefault();
            self.ExpressPostAuthenticate();
            self.ExpressPostRegister();
            self.ExpressPostUpload();
            self.ExpressPostAddSchema();
    
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
        self.app.get('/', (req, res) => {
            console.log('<-- request default');
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
            // console.log(`req.body.username: ${req.body.username}`);
            // console.log(`req.body.password: ${req.body.password}`);
            passport.authenticate('local', (error:Error, user?:any) => {
                
                if (error) {
                    return res.send({ success: false, error: error.message });
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
            // console.log(`req.body.username: ${req.body.username}`);
            // console.log(`req.body.password: ${req.body.password}`);
            User.findOne({ username: req.body.username }, async (error:any, user?:any) => {
                if (error) { 
                    return res.send({ success: false, error: error.message });
                }
                if (user) { 
                    return res.send({ success: false, error: "user already exists!" });
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
                callback(null, path.resolve(__dirname, '../../temp/'));
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
    
        self.app.post('/upload', upload.single('fld_file_0'), (req, res) => {
            console.log(`<-- request upload`);

            var file:Express.Multer.File | undefined = req.file;

            console.log(file);

            if (typeof (file) != `undefined`) {
                console.log(`upload file to cloudinary...`);
                cloudinary.v2.uploader.upload(file.path, (error) => {
                    if (error) {
                        // The results in the web browser will be returned inform of plain text formart. We shall use the util that we required at the top of this code to do this.
                        res.send({ success: false, error: error.message });
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
                    res.send({ success: false, error: error.message });
                });
            } else {
                res.send({ success: false, error: "file uploaded fails..." });
            }

        });
    }

    /**
     * Initialize database connection.
     */
    private async InitDatabase () {
        console.log(`init database...`);

        var self:Core = this;

        var uri:string = `mongodb+srv://${env.MONGODB_USER}:${env.MONGODB_PASS}@${env.MONGODB_HOST}/${env.MONGODB_DB}`;
        console.log(`connect to: ${uri}`);
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            sslValidate: false,
            sslCert: `${env.MONGODB_CERT}`
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
        }, (username, password, done) => {
            // console.log(`username: ${username}`);
            // console.log(`password: ${password}`);
            User.findOne({ username: username }, async (error:Error, user?:any) => {
                if (error) { return done(error); }
                if (!user) { return done(new Error("user does not exists"), false); }
                console.log(`user: ${user}`);
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
            cloud_name  : `${env.CLOUDINARY_NAME}`,
            api_key     : `${env.CLOUDINARY_KEY}`,
            api_secret  : `${env.CLOUDINARY_SECRET}`,
        });
    }

    /**
     * Create new model on database.
     */
    public ExpressPostAddSchema () {
        console.log(`set express post add schema...`);
    
        var self:Core = this;

        self.app.post('/add_schema', (req:express.Request, res:express.Response) => {
            console.log(`<-- request add schema`);

            var value:CustomSchema = req.body.value;
            console.log(`value: ${value}`);
            console.log(`schema: ${value.schema}`);
            console.log(`fields: ${JSON.stringify(value.fields)}`);
        });
    }
}

var c:Core = new Core();