import express from 'express';
import cors from 'cors';
import session from 'express-session';
import multer from 'multer';
import cloudinary from 'cloudinary';
import path from 'path';
import { UserDocument } from '../Models/User';
import CONFIG, { toyStatusUrl } from './CONFIG/CONFIG';
import crypto from 'crypto';
import Authentication from './DEPRECATED/Authentication';
import Database from './DEPRECATED/Database';
import Storage from './CMS/Storage';
import Build from './APPS/Build';
import Status from './APPS/Status';

import Email from './DEPRECATED/Email';
import Twitter from './USER/AUTH/Twitter';
import SOCKET from './SOCKET/SOCKET';
import CONQUER from '../Frontend/CONQUER';
import LOG, { log } from "../UTIL/LOG";
import AUTH from './USER/AUTH/AUTH';
import EMAIL from './USER/EMAIL';
import Snapchat from './USER/AUTH/Snapchat';
import Discord from './USER/AUTH/Discord';

console.log(`project path: ${__dirname}`);

class Main {

    private baseUrl: string;
    public status: Main.Status;

    /**
     * Initialize necessary components.
     */
    constructor() {
        this.status = Main.StatusDefault;
        this.baseUrl = `/webhook/v${CONFIG.CoreConfig.VERSION}`;

        this.AsyncInit(CONFIG.CoreConfig);
    }

    private async AsyncInit(env: CONFIG.Config): Promise<void> {
        try {
            console.log(`init express...`);

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
                        secret: env.EXPRESS_SECRET,
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
                        if (!adjustedUrl.match(/\.[a-zA-Z0-9_\-]+$/g) && adjustedUrl[adjustedUrl.length - 1] != '/') {
                            req.url = `${adjustedUrl}/`;
                        }
                        next();
                    });

            app.all('/', (req, res, next) => {
                req.url = req.url + 'Index.html';
                next();
            });

            app.use(`${toyStatusUrl}`, (req, res) => {
                // console.log(`[Express] /status/`);
                this.status.Builder = Status.CurrentStatus;
                res.status(200).send(JSON.stringify(this.status));
            });

            app.use('/test', (req, res) => {
                console.log(`[Express] /test/`);
                res.status(200).send('test');
            });

            // TODO : enable authentication & database
            await Authentication.AsyncInit(app, env);

            await Database.AsyncInit(app, env);
            await Email.AsyncInit(app, env);
            await Twitter.AsyncInit(app, env);
            await Snapchat.AsyncInit(app, env);
            await Discord.AsyncInit(app, env);
            // await DB.init(env);
            // routes: start
            // routes: end

            await Storage.AsyncInit(app, env);
            await Build.AsyncInit(app, env);

            app.listen(env.PORT);
            log(`[Express] listening on port ${env.PORT}`);


            // NEW CODE!
            await AUTH.init();
            await EMAIL.init(env);
            await SOCKET.init(env);


            // HACKIN

            CONQUER.init();

            // await Email.Send('garibaldy.mukti@gmail.com', 'The Subject of This Email', 'The content of this email');
        }
        catch (error) {
            console.error(error);
        }
    }

    /**
     * Set express response for POST '/upload' call.
     */
    private async ExpressPostUpload(app: express.Express) {
        console.log(`set express post upload...`);

        var self: Main = this;

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

            var file: Express.Multer.File | undefined = req.file;

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
                    .catch((error: Error) => {
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
    private async CloudinaryUploadFileStream(user: UserDocument) {
        if (!user) {
            throw new Error('each file must have a user!');
        }

        return new Promise((resolve, reject) => {
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
        Builder: Status.Detail,
        requestCount: number,
    }
    export const StatusDefault: Status = {
        Builder: Status.CurrentStatus,
        requestCount: 0,
    }
}

export default Main;

var c: Main = new Main();