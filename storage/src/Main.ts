import express, { response } from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { load } from 'ts-dotenv';
import Environment from './Environment';
import crypto from 'crypto';
import multer from 'multer';
import fs from 'fs';

console.log(`project path: ${__dirname}`);

const envPath = path.resolve(__dirname, `../.env`);
console.log(`load .env from: ${envPath}`);
const env = load(Environment, {
    path: envPath,
    encoding: 'utf-8',
}); 

class Main {

    private port:number = 9002;

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
                .use(cors({
                    origin: '*'
                }))
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
            self.ExpressPostUpload();
            self.ExpressGetExplorer();
    
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

    /**
     * Set express response for GET '/explorer' call.
     */
    private async ExpressGetExplorer () {
        console.log(`set express get explorer...`);
    
        var self:Main = this;
    
        self.app.use('/explorer', (req, res) => {
            console.log(`req.url: ${req.url}`);
            
            var folderPath = path.join(__dirname, '../public', req.url);
            
            // list all files in the directory
            fs.readdir(folderPath, (err, files) => {
                if (err) {
                    throw err;
                }

                var paths = req.url.length > 1 ? req.url.split('/') : [];
                var output:string = "";
                var numLevel = paths.length > 1 && paths[1].length > 0 ? paths.length - 1 : 0;
                var currentPath = '';
                var shouldStop = false;
                for (var i = 1; i < numLevel; i++) {
                    currentPath += `${paths[i]}`;
                }
                output += `${req.baseUrl}${req.url}<br/>`;
                if (numLevel > 0) {
                    output += `<a href='${req.baseUrl}${currentPath}'>[^]..</a><br/>`;
                }
                // files object contains all files names
                // log them on console
                files.forEach(file => {
                    console.log(`file: ${file}`);
                    var newPath = path.join(folderPath, file);
                    var isDirectory:boolean = fs.statSync(newPath).isDirectory();
                    var isFile:boolean = fs.statSync(newPath).isFile();
                    var extra1:string = numLevel > 0 ? '/' : '';
                    var extra2:string = isDirectory ? '[D]' : '[F]';
                    if (!isDirectory) {
                        output += `<a href='${req.url}${extra1}${file}'>${extra2} ${file}</a><br/>`;
                    } else {
                        output += `<a href='${req.baseUrl}${req.url}${extra1}${file}'>${extra2} ${file}</a><br/>`;
                    }
                });
                if (shouldStop) {
                    return;
                }

                res.status(200).send(output);
            });
        });
    }

    /**
     * Set express response for POST '/upload' call.
     */
    private async ExpressPostUpload () {
        console.log(`set express post upload...`);
    
        var self:Main = this;
        
        var storage = multer.diskStorage({ 
            destination: (req, file, callback) => {
                callback(null, path.resolve(__dirname, '../temp/'));
            },
            filename: (req, file, callback) => {
                console.log(`file.originalName: ${file.originalname}`);
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
    
        self.app.post(`/upload`, upload.single('file'), (req, res) => {
            console.log(`<-- request upload`);

            var file:Express.Multer.File | undefined = req.file;
            
            if (typeof (file) != `undefined`) {
                console.log(`file uploaded!`);
                
                res.send({ 
                    success: true, 
                    message: 'file uploaded!',
                    response: response
                });
            } else {
                res.send({ success: false, error: "file uploaded fails..." });
            }

        });
    }

}

new Main();