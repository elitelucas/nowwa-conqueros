import express, { response } from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { load } from 'ts-dotenv';
import Environment from './Environment';
import crypto from 'crypto';
import multer from 'multer';
import fs from 'fs';
import formidable from 'formidable';
import IncomingForm from 'formidable/Formidable';

const platform:"WIN" | "UNIX" = 'UNIX'; 

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
                })) 
                .use(express.json({
                    limit               : '200mb'
                }))
                .use(express.urlencoded({
                    extended            : false,
                    limit               : '200mb'
                }));

            self.ExpressGetDefault();
    
            console.log(`set port...`);
            self.app.listen(self.port);
            console.log(`listening on port ${self.port}`);
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
    
        self.app.use((req, res, next) => {
            console.log(`req.url: ${req.url}`);
            var adjustedUrl = req.url;
            if (adjustedUrl.indexOf('//') == 0) {
                adjustedUrl = adjustedUrl.slice(1);
            } 
            if (adjustedUrl.indexOf('/explorer') == 0) {
                console.log(`access explorer`);
                adjustedUrl = adjustedUrl.slice('/explorer'.length);
                self.ExecuteExplorer(adjustedUrl, res);
            } else if (adjustedUrl.indexOf('/upload') == 0) {
                console.log(`access upload`);
                adjustedUrl = adjustedUrl.slice('/upload'.length);
                self.ExecuteUpload(req, res);
            } else {
                console.log(`access file`);
                try {
                    fs.createReadStream(path.join(__dirname, '../public', adjustedUrl)).pipe(res);
                }
                catch (error)
                {
                    res.status(200).send(JSON.stringify(error));
                }
            }
        });
    }

    /**
     * Show file and folder explorer.
     */
    private async ExecuteExplorer (url:string, res:any) {
    
        var self:Main = this;
            
        var folderPath = path.join(__dirname, '../public', url);
        console.log(`folderPath: ${folderPath}`);
        
        // list all files in the directory
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                throw err;
            }

            var paths = url.length > 1 ? url.split('/') : [];
            var output:string = "";
            var numLevel = paths.length > 1 && paths[1].length > 0 ? paths.length - 1 : 0;
            var currentPath = '';
            var shouldStop = false;
            for (var i = 1; i < numLevel; i++) {
                currentPath += `${paths[i]}`;
            }
            output += (numLevel == 0 ? '/' : '') + `${url}<br/>`;
            var extraUrl:string = platform == 'UNIX' ? '/storage' : '';
            if (numLevel > 0) {
                output += `<a href='${extraUrl}/explorer${currentPath}'>[^]..</a><br/>`;
            }
            // files object contains all files names
            // log them on console
            files.forEach(file => {
                console.log(`file: ${file}`);
                var newPath = path.join(folderPath, file);
                var isDirectory:boolean = fs.statSync(newPath).isDirectory();
                var isFile:boolean = fs.statSync(newPath).isFile();
                var extra:string = isDirectory ? '[D]' : '[F]';
                if (!isDirectory) {
                    output += `<a href='${extraUrl}${url}/${file}'>${extra} ${file}</a><br/>`;
                } else { 
                    output += `<a href='${extraUrl}/explorer/${url}${file}'>${extra} ${file}</a><br/>`;
                }
            });
            if (shouldStop) {
                return;
            }

            res.status(200).send(output);
        });
    }

    /**
     * Handle upload file.
     */
    private async ExecuteUpload (req:any, res:any) {
        console.log(`set express post upload...`);
    
        var self:Main = this;
        
        const form:IncomingForm = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                res.end(String(err));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ fields, files }, null, 2));
            console.log(JSON.stringify({ fields, files }));
            //@ts-ignore
            var filename:string = files.file.originalFilename;
            console.log(`filename: ${filename}`);
            //@ts-ignore
            var filepath:string = files.file.filepath;
            console.log(`filepath: ${filepath}`);
            fs.renameSync(filepath, path.join(__dirname, '../public', filename));
        });
    }

}

new Main();