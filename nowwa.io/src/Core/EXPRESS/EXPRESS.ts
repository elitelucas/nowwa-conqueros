import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import cors from 'cors';
import CONFIG, { toyStatusUrl } from '../CONFIG/CONFIG';
import Status from '../APPS/Status';
import LOG, { log } from '../../UTIL/LOG';
import cloudinary from 'cloudinary';
import multer from 'multer';
import path from 'path';
import { UserDocument } from '../../Models/User';
import { readFileSync } from 'fs';
import https from 'https';

class EXPRESS {
    public static app: express.Express;
    public static status: EXPRESS.Status;
    private static baseUrl: string;

    public static init() {
        console.log(`init express...`);

        this.baseUrl = `/webhook/v${CONFIG.vars.VERSION}`;

        EXPRESS.status = EXPRESS.StatusDefault;

        var app: express.Express = EXPRESS.app =
            express()
                .use(cors())
                .use(express.json())
                .use(express.urlencoded({
                    extended: false
                }))
                .use(session({
                    genid: () => crypto.randomBytes(48).toString('hex'),
                    secret: CONFIG.vars.EXPRESS_SECRET,
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

        console.log(`running Environment: ${CONFIG.vars.ENVIRONMENT}`);
        if (CONFIG.vars.ENVIRONMENT == 'production' || CONFIG.vars.ENVIRONMENT == 'development') {
            app.listen(CONFIG.vars.CORE_PORT);
        } else if (CONFIG.vars.ENVIRONMENT == 'ssl_development') {
            const key = readFileSync(path.join(__dirname, '..', '..', '..', 'localhost.decrypted.key'));
            const cert = readFileSync(path.join(__dirname, '..', '..', '..', 'localhost.crt'));
            const server = https.createServer({ key: key, cert: cert }, app);
            server.listen(CONFIG.vars.CORE_PORT);
        }

        log(`[Express] listening on port ${CONFIG.vars.CORE_PORT}`);
    }

    private static async ExpressPostUpload() {
        var app = EXPRESS.app;

        console.log(`set express post upload...`);

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

        app.post(`${EXPRESS.baseUrl}/upload`, upload.single('fld_file_0'), (req, res) => {
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
    private static async CloudinaryUploadFileStream(user: UserDocument) {
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

    //     var EXPRESS:Main = this;

    //     console.log(`set cloudinary config...`);
    //     cloudinary.v2.config({
    //         cloud_name  : `${env.CLOUDINARY_NAME}`,
    //         api_key     : `${env.CLOUDINARY_KEY}`,
    //         api_secret  : `${env.CLOUDINARY_SECRET}`,
    //     });
    // // }
};


namespace EXPRESS {
    export type Status =
        {
            Builder: Status.Detail,
            requestCount: number
        }

    export const StatusDefault: Status =
    {
        Builder: Status.CurrentStatus,
        requestCount: 0
    }
}

export default EXPRESS;