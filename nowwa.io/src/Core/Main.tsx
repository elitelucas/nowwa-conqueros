import express, { response } from 'express';
import cors from 'cors';
import mongoose, { mongo } from 'mongoose';
import session from 'express-session';
import multer from 'multer';
import cloudinary from 'cloudinary';
import path from 'path';
import { EnvType, load } from 'ts-dotenv';
import { User, UserDocument } from '../Models/User';
import Environment from './Environment';
import crypto from 'crypto';
import Socket from './Socket';
import Authentication from './Authentication';
import { PlayCanvas } from './Playcanvas';
import Database from './Database';
import Storage from './Storage';
import Test from './Test';


console.log(`project path: ${__dirname}`);

class Main {

    private baseUrl:string;
    public status:Main.Status;

    /**
     * Initialize necessary components.
     */
    constructor () {
        this.status = Main.StatusDefault;

        let envPath:string = path.resolve(__dirname, `../../.env`);
        console.log(`load .env from: ${envPath}`);
        let env:EnvType<typeof Environment> = load(Environment, {
            path: envPath,
            encoding: 'utf-8',
        });

        this.baseUrl = `/webhook/v${env.VERSION}`;

        this.AsyncInit(env);
    }

    private async AsyncInit (env:EnvType<typeof Environment>):Promise<void> {
        try {
            console.log(`init express...`);
    
            var self:Main = this;

            var app:express.Express = 
                express()
                .use(express.json())
                .use(express.urlencoded({
                    extended            :false
                }))
                .use(cors())
                .use(session({ 
                    genid               : () => crypto.randomBytes(48).toString('hex'),
                    secret              : env.EXPRESS_SECRET,
                    resave              : true,
                    saveUninitialized   : true,
                    cookie              : {
                        maxAge          : (1000 * 60 * 100)
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
                // let didError = false;
                // let stream = ReactDOMServer.renderToPipeableStream(<Index />, {
                //     onShellReady () {
                //         res.statusCode = didError ? 500 : 200;
                //         res.setHeader('Content-type', 'text/html');
                //         stream.pipe(res);
                //     }, 
                //     onError (err) {
                //         didError = true;
                //         console.error(err);
                //     },
                // });
                req.url = req.url + 'Index.html'; 
                next();
            });

            app.use('/status/', (req, res) => {
                // console.log(`[Express] /status/`);
                this.status.requestCount++;
                if (!this.status.isPlaycanvasBusy) {
                    this.status.isPlaycanvasBusy = true;
                    this.status.requestCount = 0;
                    PlayCanvas.MockBusy()
                        .then(() => {
                            this.status.isPlaycanvasBusy = false;
                        });
                }
                res.status(200).send(JSON.stringify(this.status));
            });

            app.use('/test/', (req, res) => {
                console.log(`[Express] /test/`);
                res.status(200).send('test');
            });
            
            // TODO : enable authentication & database
            // await Authentication.AsyncInit(app, env);
            // await Database.AsyncInit(app, env);
    
            // routes: start
    
            // routes: end

            await Storage.AsyncInit(app, env);
    
            app.listen(env.MAIN_PORT);
            console.log(`[Express] listening on port ${env.MAIN_PORT}`);

            await Socket.AsyncInit(app, env);

            Test.Run();
        }
        catch (error) {
            console.error(error);
        }
    }

    private GetStatus () {
        return {
            
        }
    }

    /**
     * Set express response for POST '/upload' call.
     */
    private async ExpressPostUpload (app:express.Express) {
        console.log(`set express post upload...`);
    
        var self:Main = this;
        
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
    
        app.post(`${self.baseUrl}/upload`, upload.single('fld_file_0'), (req, res) => {
            console.log(`<-- request upload`);

            var file:Express.Multer.File | undefined = req.file;
            
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
     * Upload file stream to cloudinary.
     */
    private async CloudinaryUploadFileStream (user:UserDocument) {
        if (!user) {
            throw new Error('each file must have a user!');
        }

        return new Promise((resolve,reject) => {
            cloudinary.v2.uploader.upload_stream({

            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Initialize Cloudinary usage.
     */
    // private InitCloudinary () {
    //     console.log(`init cloudinary...`);

    //     var self:Main = this;

    //     console.log(`set cloudinary config...`);
    //     cloudinary.v2.config({
    //         cloud_name  : `${env.CLOUDINARY_NAME}`,
    //         api_key     : `${env.CLOUDINARY_KEY}`,
    //         api_secret  : `${env.CLOUDINARY_SECRET}`,
    //     });
    // // }

}

namespace Main {
    export type Status = {
        isPlaycanvasBusy: boolean;
        requestCount:number;
    }
    export const StatusDefault:Status = {
        isPlaycanvasBusy: false,
        requestCount: 0,
    }
}

var c:Main = new Main();