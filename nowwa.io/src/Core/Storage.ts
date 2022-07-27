import express from 'express';
import { EnvType } from 'ts-dotenv';
import Environment from './Environment';
import path from 'path';
import fs from 'fs';

class Storage {

    private static Instance:Storage;

    private static BaseUrl:string = `/storage`;

    public static FileUrl:string = `${Storage.BaseUrl}/files`; 

    public static ExplorerUrl:string = `${Storage.BaseUrl}/explorer`; 

    /**
     * Initialize storage module.
     */
    public static async AsyncInit (app:express.Express, env:EnvType<typeof Environment>):Promise<void> {
        Storage.Instance = new Storage();
        Storage.WebhookFiles(app);
        Storage.WebhookExplorer(app);
        Storage.WebhookDefaultFiles(app);
        return Promise.resolve();
    }

    /**
     * Webhook for exploring files. 
     * @param app @type {express.Express}
     */
    public static WebhookExplorer (app:express.Express):void {
        app.use(`${Storage.ExplorerUrl}`, async (req, res) => {
            // console.log(`<-- storage - files`);
            let folderPath:string = req.url;
            let fullPath:string = path.join(__dirname, `../../files`, folderPath);
            if (fs.existsSync(fullPath)) {
                let stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    fs.readdir(fullPath, (err, files) => {
                        if (err) {
                            throw err;
                        }

                        let filePaths:string[] = [];
                        let folderPaths:string[] = [];
                        
                        files.forEach(filePath => {
                            var newPath = path.join(fullPath, filePath);
                            var isDirectory:boolean = fs.statSync(newPath).isDirectory();
                            // var isFile:boolean = fs.statSync(newPath).isFile();
                            if (!isDirectory) {
                                filePaths.push(filePath);
                            } else { 
                                folderPaths.push(filePath);
                            }
                        });
                        
                        let output = JSON.stringify({files:filePaths, folders: folderPaths});
                        res.status(200).send(`${output}`);
                    });
                } else {
                    res.status(200).send(`NOT DIRECTORY | fullPath: ${fullPath}`);
                }
            } else {
                res.status(200).send(`NOT EXISTS | fullPath: ${fullPath}`);
            }
            
        });
    }

    /**
     * Webhook for accessing files directly. 
     * @param app @type {express.Express}
     */
    private static WebhookFiles (app:express.Express):void {
        app.use(`${Storage.FileUrl}`, async (req, res) => {
            // console.log(`<-- storage - files`);
            let filePath:string = req.url;
            let fullPath:string = path.join(__dirname, `../../files`, filePath);
            if (fs.existsSync(fullPath)) {
                fs.createReadStream(fullPath).pipe(res);
            } 
            else 
            {
                res.status(200).send(JSON.stringify(`file [${filePath}] does not exsits`));
            }
        });
    }

    /**
     * Webhook for accessing files directly. 
     * @param app @type {express.Express}
     */
    private static WebhookDefaultFiles (app:express.Express):void {
        let urls:string[] = [
            `/favicon.ico/`,
            `/apple-touch-icon-precomposed.png/`,
            `/apple-touch-icon.png/`
        ];
        for (let i:number = 0; i < urls.length; i++) {
            app.use(`${urls[i]}`, async (req, res) => {
                // console.log(`<-- storage - default files`);
                let filePath:string = req.baseUrl;
                var fullPath:string = path.join(__dirname, `../../files`, filePath);
                // console.log(`fullPath`, fullPath);
                fs.createReadStream(fullPath).pipe(res);
            });
        }
    }

    /**
     * Webhook for custom path serving.
     */
    public static WebhookCustomPath (externalPath:string, internalPath:string, app:express.Express):void {
        app.all(`${externalPath}/*`, async (req, res) => {
            // console.log(`<-- storage - files`);
            let filePath:string = req.url.replace(externalPath, '');
            var fullPath:string = path.join(__dirname, `./${internalPath}`, filePath);
            // console.log(`fullPath`, fullPath);
            if (fs.existsSync(fullPath)) {
                fs.createReadStream(fullPath).pipe(res);
            } 
            else 
            {
                res.status(200).send(`path [${externalPath}${filePath}] does not exists`);
            }
        });
    }
}

namespace Storage {

}

export default Storage;